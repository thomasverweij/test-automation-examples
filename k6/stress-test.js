import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    stages: [
        { duration: '2m', target: 100 }, // ramp up to 100 users
        { duration: '5m', target: 100 }, // stay at 100 users
        { duration: '2m', target: 200 }, // ramp up to 200 users
        { duration: '5m', target: 200 }, // stay at 200 users
        { duration: '2m', target: 0 }, // ramp down to 0
    ],
    thresholds: {
        http_req_failed: ['rate<0.1'], // http errors should be less than 10%
        http_req_duration: ['p(99)<3000'], // 99% of requests should be below 3s
    }
};

export default function() {
  let res = http.get('http://127.0.0.1:8888/');
  check(res, { 
    "status is 200": (res) => res.status === 200,
  });
  sleep(1);
}
