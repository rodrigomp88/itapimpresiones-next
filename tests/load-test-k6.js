import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Warm up
    { duration: '5m', target: 50 },   // Ramp up to 50 users
    { duration: '10m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 100 },  // Spike to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '1m', target: 0 },    // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests should be below 1s
    http_req_failed: ['rate<0.1'],     // Error rate should be below 10%
    errors: ['rate<0.1'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Test scenarios
export default function () {
  const userId = __VU; // Virtual user ID
  const iteration = __ITER; // Iteration number

  // Home page load
  const homeResponse = http.get(`${BASE_URL}/`);
  check(homeResponse, {
    'home page status is 200': (r) => r.status === 200,
    'home page response time < 1000ms': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);
  responseTime.add(homeResponse.timings.duration);

  sleep(Math.random() * 2 + 1); // Random sleep 1-3 seconds

  // Product browsing
  if (iteration % 3 === 0) { // 33% of users browse products
    const shopResponse = http.get(`${BASE_URL}/tienda`);
    check(shopResponse, {
      'shop page status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    responseTime.add(shopResponse.timings.duration);

    sleep(Math.random() * 3 + 2); // Random sleep 2-5 seconds

    const productResponse = http.get(`${BASE_URL}/producto/test-product-${userId}`);
    check(productResponse, {
      'product page status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    responseTime.add(productResponse.timings.duration);
  }

  // Cart operations
  if (iteration % 5 === 0) { // 20% of users add to cart
    const cartData = {
      productId: `product_${userId}`,
      quantity: Math.floor(Math.random() * 3) + 1,
    };

    const cartResponse = http.post(
      `${BASE_URL}/api/cart/add`,
      JSON.stringify(cartData),
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'K6-Load-Test/1.0',
        },
      }
    );

    check(cartResponse, {
      'cart add status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    responseTime.add(cartResponse.timings.duration);
  }

  // Checkout process
  if (iteration % 10 === 0) { // 10% of users attempt checkout
    const checkoutData = {
      items: [
        {
          id: `product_${userId}`,
          title: 'Test Product',
          quantity: 1,
          unit_price: 1000,
        },
      ],
    };

    const checkoutResponse = http.post(
      `${BASE_URL}/api/mercadopago/create-preference`,
      JSON.stringify(checkoutData),
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'K6-Load-Test/1.0',
        },
      }
    );

    check(checkoutResponse, {
      'checkout status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    responseTime.add(checkoutResponse.timings.duration);
  }

  // Health check
  const healthResponse = http.get(`${BASE_URL}/api/health`);
  check(healthResponse, {
    'health check status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);
  responseTime.add(healthResponse.timings.duration);

  sleep(Math.random() * 2 + 1); // Random sleep between iterations
}

// Setup function - runs before the test starts
export function setup() {
  console.log('Starting load test setup...');

  // Warm up the application
  const warmupResponse = http.get(`${BASE_URL}/`);
  if (warmupResponse.status !== 200) {
    console.error(`Warmup failed: ${warmupResponse.status}`);
  }

  return { timestamp: new Date().toISOString() };
}

// Teardown function - runs after the test completes
export function teardown(data) {
  console.log(`Load test completed. Started at: ${data.timestamp}`);
}
