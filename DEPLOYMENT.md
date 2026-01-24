# Production Deployment Guide

## AWS ECS/Fargate Deployment

### Prerequisites
- AWS CLI configured
- Docker installed
- ECR repository created
- RDS PostgreSQL instance
- ElastiCache Redis cluster
- Application Load Balancer
- Route 53 domain (optional)

### 1. Build and Push Docker Images

```bash
# Backend
cd backend
docker build -t foryou-restaurant-api .
docker tag foryou-restaurant-api:latest <account-id>.dkr.ecr.<region>.amazonaws.com/foryou-api:latest
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/foryou-api:latest

# Frontend
cd frontend
docker build -t foryou-restaurant-frontend .
docker tag foryou-restaurant-frontend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/foryou-frontend:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/foryou-frontend:latest
```

### 2. Create ECS Task Definitions

Create task definitions for both backend and frontend with:
- Container images from ECR
- Environment variables
- Resource limits (CPU/Memory)
- Health checks

### 3. Create ECS Services

```bash
# Backend service
aws ecs create-service \
  --cluster foryou-cluster \
  --service-name foryou-api \
  --task-definition foryou-api \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=api,containerPort=4000"

# Frontend service
aws ecs create-service \
  --cluster foryou-cluster \
  --service-name foryou-frontend \
  --task-definition foryou-frontend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=frontend,containerPort=3000"
```

### 4. Configure Auto Scaling

```bash
# Register scalable targets
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/foryou-cluster/foryou-api \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/foryou-cluster/foryou-api \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{"TargetValue":70.0,"PredefinedMetricSpecification":{"PredefinedMetricType":"ECSServiceAverageCPUUtilization"}}'
```

### 5. Environment Variables

Set in ECS task definitions or use AWS Systems Manager Parameter Store:

```env
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/foryou
REDIS_URL=redis://elasticache-endpoint:6379
JWT_SECRET=<generate-secure-secret>
STRIPE_SECRET_KEY=<stripe-key>
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
```

### 6. Health Checks

Configure ALB health checks:
- Backend: `/api/health`
- Frontend: `/`

### 7. SSL/TLS

Use ACM certificate with ALB HTTPS listener (port 443).

### 8. Monitoring

- CloudWatch Logs: Container logs
- CloudWatch Metrics: CPU, Memory, Request count
- X-Ray: Distributed tracing (optional)
- Sentry: Error tracking

## Database Migrations

```bash
# Run migrations on deployment
cd backend
npm run prisma:deploy
```

## Smoke Tests

After deployment, run:

```bash
# Health check
curl https://api.yourdomain.com/api/health

# Test API
curl https://api.yourdomain.com/api/menu/categories

# Test frontend
curl https://yourdomain.com
```

## Rollback

```bash
# Update service to previous task definition
aws ecs update-service \
  --cluster foryou-cluster \
  --service-name foryou-api \
  --task-definition foryou-api:<previous-revision>
```

