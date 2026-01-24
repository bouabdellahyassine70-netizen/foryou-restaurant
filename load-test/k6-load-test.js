import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    errors: ['rate<0.01'], // Error rate under 1%
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:4000/api';

export default function () {
  // Test menu endpoint
  const menuRes = http.get(`${BASE_URL}/menu/categories`);
  const menuCheck = check(menuRes, {
    'menu status is 200': (r) => r.status === 200,
    'menu response time < 500ms': (r) => r.timings.duration < 500,
  });
  errorRate.add(!menuCheck);

  sleep(1);

  // Test menu items endpoint
  const itemsRes = http.get(`${BASE_URL}/menu/items`);
  const itemsCheck = check(itemsRes, {
    'items status is 200': (r) => r.status === 200,
    'items response time < 500ms': (r) => r.timings.duration < 500,
  });
  errorRate.add(!itemsCheck);

  sleep(1);

  // Simulate order creation (without auth for load test)
  // In production, you'd need to handle auth tokens
  const orderPayload = JSON.stringify({
    items: [
      {
        menuItemId: 'item-bruschetta',
        quantity: 1,
        modifierIds: [],
      },
    ],
    type: 'DINE_IN',
  });

  const orderRes = http.post(`${BASE_URL}/orders`, orderPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  const orderCheck = check(orderRes, {
    'order status is 201 or 401': (r) => r.status === 201 || r.status === 401,
  });
  errorRate.add(!orderCheck);

  sleep(2);
}

export function handleSummary(data) {
  return {
    'stdout': JSON.stringify(data, null, 2),
    'summary.json': JSON.stringify(data, null, 2),
  };
}

