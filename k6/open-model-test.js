import http from 'k6/http';
import { check } from 'k6';

export const options = {
    scenarios: {
        open_model: {
            executor: 'ramping-arrival-rate',
            startRate: 0,
            stages: [
                { duration: '2m', target: 10 }, // ramp up to 10 requests/second
                { duration: '5m', target: 10 }, // stay at 10 requests/second
                { duration: '2m', target: 0 }, // ramp down
            ],
            preAllocatedVUs: 50,
            maxVUs: 100,
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(99)<1500'], // 99% of requests should be below 1.5s
    }
};

export default function() {
  let res = http.get('http://127.0.0.1:8888/');
  check(res, { 
    "status is 200": (res) => res.status === 200,
    "response time OK": (res) => res.timings.duration < 1500,
  });
}
