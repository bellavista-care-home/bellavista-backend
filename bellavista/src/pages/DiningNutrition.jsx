import React from 'react';
import '../styles/DiningNutrition.css';

const DiningNutrition = () => {
  return (
    <div className="dining-page">
      <div className="dining-header">
        <div className="container">
          <h1>Dining & Nutrition</h1>
          <p>Nutritious meals and a dementia-friendly dining experience</p>
        </div>
      </div>

      <div className="container" style={{ padding: '80px 0' }}>
        
        {/* Intro Section */}
        <div className="intro-section" style={{ maxWidth: '900px', margin: '0 auto 80px' }}>
          
          <div className="quote-wrapper" style={{ textAlign: 'center', marginBottom: '50px' }}>
             <i className="fas fa-quote-left" style={{ fontSize: '3rem', color: '#e0e0e0', display: 'block', marginBottom: '20px' }}></i>
             <p style={{ fontSize: '1.8rem', fontStyle: 'italic', color: '#333', lineHeight: '1.6', fontFamily: 'Georgia, serif' }}>
               "We attach high importance to residents meals and our cooks spend time with them to learn their tastes and preferences..."
             </p>
          </div>

          <div className="intro-text-card" style={{ 
            background: '#fff', 
            padding: '40px', 
            borderRadius: '20px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}>
             <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: 'linear-gradient(to bottom, var(--color-primary), var(--color-secondary))' }}></div>
             <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333' }}>Nutrition Matters</h3>
             <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#555' }}>
               Getting the right nutritional value from food is important throughout our lives, but arguably more important than ever in our later years. So you’ll be reassured to know that we don’t leave nutrition to chance. Our Kitchen team maintains the highest standards of traditional home cooking, providing a choice of meals and tempting snacks around the clock served in either of our two dining rooms or in your own room if preferred. We can also cater for private functions and your visitors are always welcome to join you at mealtimes.
             </p>
             <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#555', marginTop: '20px' }}>
               We have varied menus to accommodate every one’s taste and needs. We take care to help people when they need it and to do so sensitively. We encourage relatives to join us for meals.
             </p>
          </div>
        </div>

        {/* Menu Samples */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ 
            display: 'inline-block', 
            padding: '8px 16px', 
            background: '#e8f5e9', 
            color: '#2e7d32', 
            borderRadius: '30px', 
            fontWeight: '600', 
            fontSize: '0.9rem',
            marginBottom: '15px'
          }}>FRESH & DELICIOUS</span>
          <h2 style={{ fontSize: '2.5rem', color: '#333', margin: 0 }}>Weekly Sample Menus</h2>
        </div>
        
        <div className="menus-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '50px',
          marginBottom: '80px'
        }}>
          
          {/* Menu 1 */}
          <div className="menu-card" style={{ 
            background: '#fff', 
            borderRadius: '20px', 
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--color-primary), #1a4a7c)', 
              padding: '30px', 
              color: '#fff', 
              textAlign: 'center',
              position: 'relative'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.8rem', fontFamily: 'serif' }}>Friday</h3>
              <p style={{ margin: '5px 0 0', opacity: 0.9, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Week 3 Selection</p>
            </div>
            
            <div className="menu-content" style={{ padding: '40px 30px' }}>
              
              {/* Breakfast */}
              <div className="menu-course" style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ width: '30px', height: '30px', background: '#fff3e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#f57c00' }}>
                    <i className="fas fa-sun"></i>
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>Breakfast</h4>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, color: '#666', fontSize: '1rem', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '8px' }}>• Choice of Cereals & Porridge</li>
                  <li style={{ marginBottom: '8px' }}>• Toast with Preserves & Fresh Fruits</li>
                  <li style={{ marginBottom: '8px' }}>• Eggs: Scrambled, Poached, Omelette, Fried or Boiled</li>
                  <li style={{ marginBottom: '8px' }}>• Cooked Breakfast: Bacon, Sausage, Hash brown, Beans</li>
                </ul>
              </div>

              {/* Mid-Morning */}
              <div className="menu-course" style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                   <div style={{ width: '30px', height: '30px', background: '#e0f2f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#00695c' }}>
                    <i className="fas fa-coffee"></i>
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>Mid-Morning</h4>
                </div>
                <p style={{ margin: 0, color: '#666' }}>Tea/Coffee, Biscuits, Squash, Fresh Juice, Freshly Made Cake</p>
              </div>

              {/* Lunch */}
              <div className="menu-course" style={{ marginBottom: '30px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                   <div style={{ width: '30px', height: '30px', background: '#e3f2fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#1565c0' }}>
                    <i className="fas fa-utensils"></i>
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>Lunch</h4>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, color: '#666', fontSize: '1rem', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '8px', fontWeight: '500', color: '#444' }}>Fried Fish & Chips with mushy peas</li>
                  <li style={{ marginBottom: '8px' }}>Lamb Curry with Rice</li>
                  <li style={{ marginBottom: '8px' }}>Scampi served with salad & Chips</li>
                  <li style={{ marginBottom: '8px' }}>Cauliflower cheese</li>
                  <li style={{ marginTop: '10px', fontStyle: 'italic', color: '#888' }}>Dessert: Eton Mess, Fresh Fruits & Yoghurt</li>
                </ul>
              </div>

              {/* Supper */}
              <div className="menu-course">
                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                   <div style={{ width: '30px', height: '30px', background: '#f3e5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#7b1fa2' }}>
                    <i className="fas fa-moon"></i>
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>Supper</h4>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, color: '#666', fontSize: '1rem', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '5px' }}>Soup: Butternut Squash Soup</li>
                  <li style={{ marginBottom: '5px' }}>Jacket Potato with Toppings</li>
                  <li style={{ marginBottom: '5px' }}>Selection of Sandwiches</li>
                  <li style={{ fontStyle: 'italic', color: '#888' }}>Dessert: Jelly & Ice cream</li>
                </ul>
              </div>

            </div>
          </div>

          {/* Menu 2 */}
          <div className="menu-card" style={{ 
            background: '#fff', 
            borderRadius: '20px', 
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--color-secondary), #c2185b)', 
              padding: '30px', 
              color: '#fff', 
              textAlign: 'center',
              position: 'relative'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.8rem', fontFamily: 'serif' }}>Wednesday</h3>
              <p style={{ margin: '5px 0 0', opacity: 0.9, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Week 4 Selection</p>
            </div>
            
            <div className="menu-content" style={{ padding: '40px 30px' }}>
              
              {/* Breakfast */}
              <div className="menu-course" style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ width: '30px', height: '30px', background: '#fff3e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#f57c00' }}>
                    <i className="fas fa-sun"></i>
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>Breakfast</h4>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, color: '#666', fontSize: '1rem', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '8px' }}>• Choice of Cereals & Porridge</li>
                  <li style={{ marginBottom: '8px' }}>• Toast with Preserves & Fresh Fruits</li>
                  <li style={{ marginBottom: '8px' }}>• Eggs: Scrambled, Poached, Omelette, Fried or Boiled</li>
                  <li style={{ marginBottom: '8px' }}>• Cooked Breakfast: Bacon, Sausage, Hash brown, Beans</li>
                </ul>
              </div>

              {/* Mid-Morning */}
              <div className="menu-course" style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                   <div style={{ width: '30px', height: '30px', background: '#e0f2f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#00695c' }}>
                    <i className="fas fa-coffee"></i>
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>Mid-Morning</h4>
                </div>
                <p style={{ margin: 0, color: '#666' }}>Tea/Coffee, Biscuits, Hot Cross Buns, Tea cake, Squash, Fresh Juice</p>
              </div>

              {/* Lunch */}
              <div className="menu-course" style={{ marginBottom: '30px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                   <div style={{ width: '30px', height: '30px', background: '#e3f2fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', color: '#1565c0' }}>
                    <i className="fas fa-utensils"></i>
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>Lunch</h4>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, color: '#666', fontSize: '1rem', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '8px', fontWeight: '500', color: '#444' }}>Roast Pork & Stuffing with gravy</li>
                  <li style={{ marginBottom: '8px' }}>Roast Chicken with Boiled Potatoes</li>
                  <li style={{ marginBottom: '8px' }}>Fish Pie / Vegetable Lasagne</li>
                  <li style={{ marginBottom: '8px' }}>Seasonal Vegetables</li>
                  <li style={{ marginTop: '10px', fontStyle: 'italic', color: '#888' }}>Dessert: Jelly & Ice cream, Fresh Fruits</li>
                </ul>
              </div>

              {/* Supper */}
              <div className="menu-course">
                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                   <div style={{ width: '30px', height: '30px', background: '#f3e5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#7b1fa2' }}>
                    <i className="fas fa-moon"></i>
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>Supper</h4>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, color: '#666', fontSize: '1rem', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '5px' }}>Soup: Cream of Chicken</li>
                  <li style={{ marginBottom: '5px' }}>Pasta Bolognaise / Hot Dogs</li>
                  <li style={{ marginBottom: '5px' }}>Selection of Sandwiches</li>
                  <li style={{ fontStyle: 'italic', color: '#888' }}>Dessert: Lemon Cake</li>
                </ul>
              </div>

            </div>
          </div>

        </div>

        {/* Special Requirements */}
        <div className="special-req-container" style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
          <div style={{ 
            background: '#333', 
            borderRadius: '20px', 
            padding: '50px', 
            color: '#fff', 
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
             {/* Decorative circle */}
             <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
             <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>

             <i className="fas fa-leaf" style={{ fontSize: '2.5rem', color: '#81c784', marginBottom: '20px', display: 'block' }}></i>
             <h3 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: '300' }}>Dietary Requirements</h3>
             
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px' }}>
                  <i className="fas fa-check" style={{ color: '#81c784', marginRight: '8px' }}></i> Diabetic Special
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px' }}>
                  <i className="fas fa-check" style={{ color: '#81c784', marginRight: '8px' }}></i> Gluten Free
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px' }}>
                  <i className="fas fa-check" style={{ color: '#81c784', marginRight: '8px' }}></i> Dairy Free
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px' }}>
                  <i className="fas fa-check" style={{ color: '#81c784', marginRight: '8px' }}></i> Vegetarian/Halal
                </div>
             </div>

             <p style={{ fontSize: '1.1rem', opacity: 0.8, maxWidth: '700px', margin: '0 auto' }}>
               Meals are fortified with Milk, Butter, and cheese as appropriate. Tea, Coffee, Fruit Juice, Soft Drinks, and Snacks are available throughout the day.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DiningNutrition;
