"""
Meal Plans API Routes
Handles dynamic meal planning for each Bellavista home.
Includes role-based access control (SuperAdmin and HomeAdmin)
"""

import json
import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify
from functools import wraps
from .models import MealPlan, Home, User
from .auth import require_auth
from . import db

meal_plans_bp = Blueprint('meal_plans', __name__, url_prefix='/meal-plans')

def home_admin_or_superadmin(f):
    """
    Decorator to check if user is super admin or admin for that specific home
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Extract user info from request.auth_payload (set by require_auth decorator)
            if not hasattr(request, 'auth_payload') or not request.auth_payload:
                return jsonify({'error': 'Authentication required'}), 401
            
            payload = request.auth_payload
            user_role = payload.get('role')
            home_id = payload.get('home_id')
            
            # Get homeId from request (could be from params, body, or URL)
            request_home_id = None
            if request.view_args:
                request_home_id = request.view_args.get('home_id')
            if not request_home_id:
                request_home_id = request.args.get('homeId')
            if not request_home_id:
                try:
                    body = request.get_json(silent=True) or {}
                    request_home_id = body.get('homeId')
                except Exception:
                    pass
            
            # SuperAdmin can access any home
            if user_role == 'superadmin':
                request.target_home_id = request_home_id
                return f(*args, **kwargs)
            
            # HomeAdmin can only access their assigned home
            if user_role == 'home_admin' and home_id == request_home_id:
                request.target_home_id = request_home_id
                return f(*args, **kwargs)
            
            return jsonify({'error': 'Unauthorized - insufficient permissions'}), 403
        
        except Exception as e:
            print(f"[ERROR] Authorization check failed: {str(e)}", flush=True)
            return jsonify({'error': f'Authorization check failed: {str(e)}'}), 401
    
    return decorated_function

@meal_plans_bp.route('/<home_id>', methods=['GET'])
def get_meal_plans(home_id):
    """
    Get all meal plans for a specific home
    Optional query params:
    - dayOfWeek: Filter by day (Monday, Tuesday, etc.)
    - mealType: Filter by meal type (Breakfast, Lunch, etc.)
    - date: Filter by specific date (YYYY-MM-DD)
    """
    try:
        # Verify home exists
        home = Home.query.get(home_id)
        if not home:
            return jsonify({'error': 'Home not found'}), 404
        
        # Build query
        query = MealPlan.query.filter_by(homeId=home_id, isActive=True)
        
        # Filter by day of week if provided
        day_of_week = request.args.get('dayOfWeek')
        if day_of_week:
            query = query.filter_by(dayOfWeek=day_of_week)
        
        # Filter by meal type if provided
        meal_type = request.args.get('mealType')
        if meal_type:
            query = query.filter_by(mealType=meal_type)
        
        # Get all meal plans
        meal_plans = query.order_by(MealPlan.dayOfWeek, MealPlan.order).all()
        
        # Format response
        result = []
        for meal in meal_plans:
            result.append({
                'id': meal.id,
                'homeId': meal.homeId,
                'dayOfWeek': meal.dayOfWeek,
                'mealType': meal.mealType,
                'mealName': meal.mealName,
                'description': meal.description,
                'ingredients': json.loads(meal.ingredients) if meal.ingredients else [],
                'allergyInfo': json.loads(meal.allergyInfo) if meal.allergyInfo else [],
                'imageUrl': meal.imageUrl,
                'nutritionalInfo': json.loads(meal.nutritionalInfo) if meal.nutritionalInfo else {},
                'tags': json.loads(meal.tags) if meal.tags else [],
                'isSpecialMenu': meal.isSpecialMenu,
                'effectiveDate': meal.effectiveDate,
                'createdAt': meal.createdAt.isoformat() if meal.createdAt else None,
                'updatedAt': meal.updatedAt.isoformat() if meal.updatedAt else None
            })
        
        # Group by day if requested
        group_by_day = request.args.get('groupByDay', 'false').lower() == 'true'
        if group_by_day:
            grouped = {}
            for meal in result:
                day = meal['dayOfWeek']
                if day not in grouped:
                    grouped[day] = []
                grouped[day].append(meal)
            return jsonify({'success': True, 'data': grouped}), 200
        
        return jsonify({'success': True, 'data': result}), 200
    
    except Exception as e:
        print(f"[ERROR] Failed to get meal plans: {str(e)}", flush=True)
        return jsonify({'error': f'Failed to fetch meal plans: {str(e)}'}), 500

@meal_plans_bp.route('/', methods=['POST'])
@require_auth
@home_admin_or_superadmin
def create_meal_plan():
    """
    Create a new meal plan
    Requires: token_required + home_admin_or_superadmin permissions
    Body: {
        homeId, dayOfWeek, mealType, mealName, description,
        ingredients[], allergyInfo[], imageUrl, nutritionalInfo{},
        tags[], isSpecialMenu, effectiveDate
    }
    """
    try:
        data = request.get_json()
        
        # Validation
        required_fields = ['homeId', 'dayOfWeek', 'mealType', 'mealName']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Verify home exists
        home = Home.query.get(data['homeId'])
        if not home:
            return jsonify({'error': 'Home not found'}), 404
        
        # Create meal plan
        meal_plan = MealPlan(
            id=str(uuid.uuid4()),
            homeId=data['homeId'],
            dayOfWeek=data['dayOfWeek'],
            mealType=data['mealType'],
            mealName=data['mealName'],
            description=data.get('description', ''),
            ingredients=json.dumps(data.get('ingredients', [])),
            allergyInfo=json.dumps(data.get('allergyInfo', [])),
            imageUrl=data.get('imageUrl', ''),
            nutritionalInfo=json.dumps(data.get('nutritionalInfo', {})),
            tags=json.dumps(data.get('tags', [])),
            isSpecialMenu=data.get('isSpecialMenu', False),
            effectiveDate=data.get('effectiveDate'),
            createdBy=request.auth_payload.get('user_id')
        )
        
        db.session.add(meal_plan)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Meal plan created successfully',
            'id': meal_plan.id
        }), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Failed to create meal plan: {str(e)}", flush=True)
        return jsonify({'error': f'Failed to create meal plan: {str(e)}'}), 500

@meal_plans_bp.route('/<meal_plan_id>', methods=['PUT'])
@require_auth
@home_admin_or_superadmin
def update_meal_plan(meal_plan_id):
    """
    Update an existing meal plan
    Requires: token_required + home_admin_or_superadmin permissions
    """
    try:
        meal_plan = MealPlan.query.get(meal_plan_id)
        if not meal_plan:
            return jsonify({'error': 'Meal plan not found'}), 404
        
        # Verify user has permission for this home
        user_role = request.auth_payload.get('role')
        home_id = request.auth_payload.get('home_id')
        if user_role == 'home_admin' and home_id != meal_plan.homeId:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        # Update fields
        if 'mealName' in data:
            meal_plan.mealName = data['mealName']
        if 'description' in data:
            meal_plan.description = data['description']
        if 'dayOfWeek' in data:
            meal_plan.dayOfWeek = data['dayOfWeek']
        if 'mealType' in data:
            meal_plan.mealType = data['mealType']
        if 'ingredients' in data:
            meal_plan.ingredients = json.dumps(data['ingredients'])
        if 'allergyInfo' in data:
            meal_plan.allergyInfo = json.dumps(data['allergyInfo'])
        if 'imageUrl' in data:
            meal_plan.imageUrl = data['imageUrl']
        if 'nutritionalInfo' in data:
            meal_plan.nutritionalInfo = json.dumps(data['nutritionalInfo'])
        if 'tags' in data:
            meal_plan.tags = json.dumps(data['tags'])
        if 'isSpecialMenu' in data:
            meal_plan.isSpecialMenu = data['isSpecialMenu']
        if 'effectiveDate' in data:
            meal_plan.effectiveDate = data['effectiveDate']
        if 'isActive' in data:
            meal_plan.isActive = data['isActive']
        
        meal_plan.updatedAt = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Meal plan updated successfully'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Failed to update meal plan: {str(e)}", flush=True)
        return jsonify({'error': f'Failed to update meal plan: {str(e)}'}), 500

@meal_plans_bp.route('/<meal_plan_id>', methods=['DELETE'])
@require_auth
@home_admin_or_superadmin
def delete_meal_plan(meal_plan_id):
    """
    Delete (soft delete) a meal plan
    Requires: token_required + home_admin_or_superadmin permissions
    """
    try:
        meal_plan = MealPlan.query.get(meal_plan_id)
        if not meal_plan:
            return jsonify({'error': 'Meal plan not found'}), 404
        
        # Verify user has permission
        user_role = request.auth_payload.get('role')
        home_id = request.auth_payload.get('home_id')
        if user_role == 'home_admin' and home_id != meal_plan.homeId:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Soft delete
        meal_plan.isActive = False
        meal_plan.updatedAt = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Meal plan deleted successfully'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Failed to delete meal plan: {str(e)}", flush=True)
        return jsonify({'error': f'Failed to delete meal plan: {str(e)}'}), 500

@meal_plans_bp.route('/bulk-create', methods=['POST'])
@require_auth
@home_admin_or_superadmin
def bulk_create_meal_plans():
    """
    Create multiple meal plans in one request
    Body: {
        homeId,
        meals: [
            { dayOfWeek, mealType, mealName, ... },
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        
        if 'homeId' not in data or 'meals' not in data:
            return jsonify({'error': 'Missing homeId or meals'}), 400
        
        home_id = data['homeId']
        meals = data['meals']
        
        # Verify home exists
        home = Home.query.get(home_id)
        if not home:
            return jsonify({'error': 'Home not found'}), 404
        
        created_count = 0
        for meal_data in meals:
            try:
                meal_plan = MealPlan(
                    id=str(uuid.uuid4()),
                    homeId=home_id,
                    dayOfWeek=meal_data.get('dayOfWeek'),
                    mealType=meal_data.get('mealType'),
                    mealName=meal_data.get('mealName'),
                    description=meal_data.get('description', ''),
                    ingredients=json.dumps(meal_data.get('ingredients', [])),
                    allergyInfo=json.dumps(meal_data.get('allergyInfo', [])),
                    imageUrl=meal_data.get('imageUrl', ''),
                    nutritionalInfo=json.dumps(meal_data.get('nutritionalInfo', {})),
                    tags=json.dumps(meal_data.get('tags', [])),
                    isSpecialMenu=meal_data.get('isSpecialMenu', False),
                    effectiveDate=meal_data.get('effectiveDate'),
                    createdBy=request.auth_payload.get('user_id')
                )
                db.session.add(meal_plan)
                created_count += 1
            except Exception as e:
                print(f"[WARNING] Failed to create meal in bulk: {str(e)}", flush=True)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Created {created_count} meal plans',
            'created': created_count,
            'total': len(meals)
        }), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Failed bulk create: {str(e)}", flush=True)
        return jsonify({'error': f'Failed bulk create: {str(e)}'}), 500


@meal_plans_bp.route('/copy-week', methods=['POST'])
@require_auth
@home_admin_or_superadmin
def copy_week_meal_plans():
    """Copy date-specific meal plans from one week to another.
    Body: { homeId: str, sourceWeekStart: 'YYYY-MM-DD', targetWeekStart?: 'YYYY-MM-DD' }
    If targetWeekStart is omitted, copies to sourceWeekStart + 7 days.
    """
    try:
        data = request.get_json() or {}
        home_id = data.get('homeId')
        source_start = data.get('sourceWeekStart')
        target_start = data.get('targetWeekStart')

        if not home_id or not source_start:
            return jsonify({'error': 'homeId and sourceWeekStart are required'}), 400

        # parse dates (expecting YYYY-MM-DD)
        from datetime import datetime, timedelta
        try:
            src = datetime.strptime(source_start, '%Y-%m-%d').date()
        except Exception:
            return jsonify({'error': 'sourceWeekStart must be YYYY-MM-DD'}), 400

        if target_start:
            try:
                tgt = datetime.strptime(target_start, '%Y-%m-%d').date()
            except Exception:
                return jsonify({'error': 'targetWeekStart must be YYYY-MM-DD'}), 400
        else:
            tgt = src + timedelta(days=7)

        # Verify home exists
        home = Home.query.get(home_id)
        if not home:
            return jsonify({'error': 'Home not found'}), 404

        src_end = src + timedelta(days=6)
        created = 0
        skipped = 0

        # Find date-specific meals in source week
        meals = MealPlan.query.filter(
            MealPlan.homeId == home_id,
            MealPlan.isActive == True,
            MealPlan.effectiveDate != None,
            MealPlan.effectiveDate >= src.isoformat(),
            MealPlan.effectiveDate <= src_end.isoformat()
        ).all()

        for meal in meals:
            # compute new date offset
            day_delta = (datetime.strptime(meal.effectiveDate, '%Y-%m-%d').date() - src).days
            new_date = (tgt + timedelta(days=day_delta)).isoformat()

            # check for existing meal on target date with same mealType and mealName
            exists = MealPlan.query.filter_by(homeId=home_id, effectiveDate=new_date, mealType=meal.mealType, mealName=meal.mealName, isActive=True).first()
            if exists:
                skipped += 1
                continue

            new_meal = MealPlan(
                id=str(uuid.uuid4()),
                homeId=meal.homeId,
                dayOfWeek=meal.dayOfWeek,
                mealType=meal.mealType,
                mealName=meal.mealName,
                description=meal.description,
                ingredients=meal.ingredients,
                allergyInfo=meal.allergyInfo,
                imageUrl=meal.imageUrl,
                nutritionalInfo=meal.nutritionalInfo,
                tags=meal.tags,
                isSpecialMenu=meal.isSpecialMenu,
                effectiveDate=new_date,
                isActive=True,
                order=getattr(meal, 'order', 0),
                createdBy=request.auth_payload.get('user_id')
            )
            db.session.add(new_meal)
            created += 1

        db.session.commit()
        return jsonify({'success': True, 'created': created, 'skipped': skipped}), 201

    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] copy_week_meal_plans failed: {str(e)}", flush=True)
        return jsonify({'error': str(e)}), 500
        return jsonify({'error': f'Failed to create meal plans: {str(e)}'}), 500
