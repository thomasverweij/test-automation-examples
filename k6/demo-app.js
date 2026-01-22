import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 10,
    duration: '30s',
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(99)<1000'], // 99% of requests should be below 1s
    }
};


export default function() {
  let res = http.get('http://127.0.0.1:8888/api/error');
  check(res, { "status is 200": (res) => res.status === 200 });
  sleep(1);
}
