# AWS Deployment Overview

## Prerequisites
- AWS account with IAM role for GitHub OIDC (`AWS_ROLE_TO_ASSUME`)
- ECR repository for backend images (`ECR_REPOSITORY`)
- ECS cluster and service (Fargate) (`ECS_CLUSTER`, `ECS_SERVICE`)
- CloudWatch Logs group `/ecs/bellavista-backend`

## Configure GitHub Secrets
- `AWS_REGION`: e.g. `eu-west-1`
- `AWS_ROLE_TO_ASSUME`: IAM role ARN with ECR push and ECS deploy permissions
- `ECR_REPOSITORY`: repository name in ECR
- `ECS_CLUSTER`: ECS cluster name
- `ECS_SERVICE`: ECS service name

## CI/CD Flow
1. On push to `main`, workflow builds Docker image from `backend/Dockerfile`
2. Pushes image to ECR with tag `<GITHUB_SHA>`
3. Renders task definition using `infra/task-definition.json`
4. Updates ECS service to new task definition

## Task Definition Notes
- Update `executionRoleArn`, `taskRoleArn`, and `awslogs-region`
- Replace `ALLOWED_ORIGINS` with your frontend domain
- Consider moving secrets to SSM or Secrets Manager and reference them in task definition
