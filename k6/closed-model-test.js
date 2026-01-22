import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    scenarios: {
        closed_model: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '2m', target: 50 }, // ramp up to 50 VUs
                { duration: '5m', target: 100 }, // ramp up to 100 VUs
                { duration: '2m', target: 0 }, // ramp down
            ],
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.05'], // http errors should be less than 5%
        http_req_duration: ['p(95)<2000', 'p(99)<3000'], // 95% below 2s, 99% below 3s
    }
};

export default function() {
  let res = http.get('http://127.0.0.1:8888/');
  check(res, { 
    "status is 200": (res) => res.status === 200,
    "response time acceptable": (res) => res.timings.duration < 3000,
  });
  sleep(1);
}
