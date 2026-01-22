import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 1,
    duration: '30s',
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(99)<1000'], // 99% of requests should be below 1s
    }
};

export default function() {
  // Test home page
  let homeRes = http.get('http://127.0.0.1:8888/');
  check(homeRes, { 
    "home: status is 200": (r) => r.status === 200,
  });
  sleep(1);

  // Test API data endpoint
  let apiRes = http.get('http://127.0.0.1:8888/api/data');
  check(apiRes, { 
    "api/data: status is 200": (r) => r.status === 200,
    "api/data: valid JSON response": (r) => r.json('message') === 'Hello from API',
  });
  sleep(1);

  // Test login page
  let loginRes = http.get('http://127.0.0.1:8888/login');
  check(loginRes, { 
    "login: status is 200": (r) => r.status === 200,
  });
  sleep(1);

  // Test auth status endpoint
  let authRes = http.get('http://127.0.0.1:8888/auth/status');
  check(authRes, { 
    "auth/status: status is 200": (r) => r.status === 200,
    "auth/status: returns authenticated field": (r) => r.json('authenticated') !== undefined,
  });
  sleep(1);
}
