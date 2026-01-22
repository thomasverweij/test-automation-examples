import http from 'k6/http';
import { sleep, check, group } from 'k6';

export const options = {
    vus: 10,
    duration: '30s',
    thresholds: {
        http_req_duration: ['p(95)<1000'], // 95% of requests should be below 1s
        'http_req_duration{page:home}': ['p(95)<500'], // home page should be fast
        'checks{test:api}': ['rate>0.95'], // API checks should pass >95% of the time
    }
};

export default function() {
  // Test home page
  group('Home Page', function() {
    let res = http.get('http://127.0.0.1:8888/', {
      tags: { page: 'home' }
    });
    check(res, { 
      "home: status is 200": (r) => r.status === 200,
      "home: contains title": (r) => r.body.includes('Test Automation Examples'),
    });
  });
  sleep(1);

  // Test API data endpoint
  group('API Data', function() {
    let res = http.get('http://127.0.0.1:8888/api/data', {
      tags: { page: 'api' }
    });
    check(res, { 
      "api/data: status is 200": (r) => r.status === 200,
      "api/data: has correct message": (r) => r.json('message') === 'Hello from API',
      "api/data: has items array": (r) => Array.isArray(r.json('data.items')),
    }, { test: 'api' });
  });
  sleep(1);

  // Test unreliable endpoint (expects some failures)
  group('Unreliable API', function() {
    let res = http.get('http://127.0.0.1:8888/api/unreliable');
    check(res, { 
      "unreliable: returns response": (r) => r.status === 200 || r.status === 500,
      "unreliable: has message field": (r) => r.json('message') !== undefined || r.json('error') !== undefined,
    });
  });
  sleep(1);

  // Test slow endpoint
  group('Slow API', function() {
    let res = http.get('http://127.0.0.1:8888/api/slow');
    check(res, { 
      "slow: status is 200": (r) => r.status === 200,
      "slow: has delay info": (r) => r.json('delay') !== undefined,
    });
  });
  sleep(1);

  // Test login flow
  group('Login Flow', function() {
    // First get login page
    let loginPage = http.get('http://127.0.0.1:8888/login');
    check(loginPage, {
      "login page: status is 200": (r) => r.status === 200,
    });
    
    sleep(0.5);
    
    // Attempt login (will fail without valid credentials but tests the endpoint)
    let loginAttempt = http.post('http://127.0.0.1:8888/login', {
      username: 'user2',
      password: 'password2'
    });
    check(loginAttempt, {
      "login: receives response": (r) => r.status === 302 || r.status === 401,
    });
  });
  sleep(1);
}
