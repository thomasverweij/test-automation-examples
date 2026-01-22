import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 1,
    duration: '10s',
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(99)<500'], // 99% of requests should be below 500ms
    }
};

export default function() {
  let res = http.get('http://127.0.0.1:8888/');
  check(res, { 
    "status is 200": (res) => res.status === 200,
    "page load time OK": (res) => res.timings.duration < 500,
  });
  sleep(1);
}
