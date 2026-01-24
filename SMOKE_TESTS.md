# Smoke Test Checklist

Run these tests after deployment to verify system health.

## Pre-Deployment

- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] Docker images built and pushed
- [ ] ECS services created
- [ ] Load balancer configured
- [ ] SSL certificates installed

## API Tests

```bash
# 1. Health Check
curl https://api.yourdomain.com/api/health
# Expected: 200 OK

# 2. Get Menu Categories (Public)
curl https://api.yourdomain.com/api/menu/categories
# Expected: 200 OK with categories array

# 3. Get Menu Items (Public)
curl https://api.yourdomain.com/api/menu/items
# Expected: 200 OK with items array

# 4. Register User
curl -X POST https://api.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456","firstName":"Test"}'
# Expected: 201 Created with access_token

# 5. Login
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'
# Expected: 200 OK with access_token

# 6. Create Order (with auth token)
TOKEN="your-token-here"
curl -X POST https://api.yourdomain.com/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"items":[{"menuItemId":"item-bruschetta","quantity":1}],"type":"DINE_IN"}'
# Expected: 201 Created with order object

# 7. Get Orders
curl https://api.yourdomain.com/api/orders \
  -H "Authorization: Bearer $TOKEN"
# Expected: 200 OK with orders array

# 8. Update Order Status (Admin)
curl -X PATCH https://api.yourdomain.com/api/orders/{orderId}/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"status":"ACCEPTED"}'
# Expected: 200 OK with updated order
```

## Frontend Tests

1. **Homepage Loads**
   - Navigate to https://yourdomain.com
   - Verify menu displays
   - Check cart functionality

2. **Menu Browsing**
   - Click on menu items
   - Verify modifiers display
   - Add items to cart

3. **Checkout Flow**
   - Add items to cart
   - Proceed to checkout
   - Verify order creation

4. **Order Tracking**
   - Create an order
   - Navigate to order tracking page
   - Verify status updates

5. **Admin Dashboard**
   - Login as admin
   - Navigate to /admin
   - Verify orders list
   - Test status updates

6. **Kitchen Display**
   - Navigate to /kitchen
   - Verify real-time order updates
   - Test status changes

## WebSocket Tests

```javascript
// Test WebSocket connection
const io = require('socket.io-client');
const socket = io('https://api.yourdomain.com');

socket.on('connect', () => {
  console.log('Connected');
  socket.emit('join-kitchen');
});

socket.on('order_created', (order) => {
  console.log('Order created:', order);
});

socket.on('order_status_changed', (order) => {
  console.log('Status changed:', order);
});
```

## Performance Tests

```bash
# Run k6 load test
k6 run load-test/k6-load-test.js --env API_URL=https://api.yourdomain.com/api

# Expected:
# - 95% of requests < 500ms
# - Error rate < 1%
# - Handles 200 concurrent users
```

## Database Tests

```bash
# Connect to RDS
psql -h your-rds-endpoint -U foryou -d foryou_restaurant

# Verify tables
\dt

# Check order count
SELECT COUNT(*) FROM "Order";

# Check recent orders
SELECT "orderNumber", status, "createdAt" FROM "Order" ORDER BY "createdAt" DESC LIMIT 10;
```

## Monitoring Checks

- [ ] CloudWatch logs showing no errors
- [ ] CloudWatch metrics within normal ranges
- [ ] Sentry showing no critical errors
- [ ] ALB target health checks passing
- [ ] ECS service running desired count
- [ ] Auto-scaling working correctly

## Security Checks

- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] JWT tokens working
- [ ] Admin routes protected
- [ ] SQL injection protection (Prisma)
- [ ] XSS protection (Next.js)

## Post-Deployment

- [ ] All smoke tests passing
- [ ] Monitoring dashboards set up
- [ ] Alerts configured
- [ ] Backup strategy in place
- [ ] Documentation updated

