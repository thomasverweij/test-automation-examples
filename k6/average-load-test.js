import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 50,
    duration: '5m',
    thresholds: {
        http_req_failed: ['rate<0.05'], // http errors should be less than 5%
        http_req_duration: ['p(95)<1500', 'p(99)<2000'], // 95% below 1.5s, 99% below 2s
    }
};

export default function() {
  // Test home page
  let homeRes = http.get('http://127.0.0.1:8888/');
  check(homeRes, { 
    "home: status is 200": (r) => r.status === 200,
    "home: response time acceptable": (r) => r.timings.duration < 2000,
  });
  sleep(1);

  // Test API data endpoint
  let apiRes = http.get('http://127.0.0.1:8888/api/data');
  check(apiRes, { 
    "api/data: status is 200": (r) => r.status === 200,
    "api/data: has message": (r) => r.json('message') !== undefined,
    "api/data: has items": (r) => r.json('data.items') !== undefined,
  });
  sleep(1);

  // Test login page
  let loginRes = http.get('http://127.0.0.1:8888/login');
  check(loginRes, { 
    "login: status is 200": (r) => r.status === 200,
  });
  sleep(1);
}
