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
  let res = http.get('http://127.0.0.1:8888/');
  check(res, { 
    "status is 200": (res) => res.status === 200,
    "response time acceptable": (res) => res.timings.duration < 2000,
  });
  sleep(1);
}
