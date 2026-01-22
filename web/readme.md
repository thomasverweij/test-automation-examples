# web example

## install

```bash
cd web
npm install
npm start
```

## routes
### public
- `GET /` - Main page with API examples, locator testing, and authentication
- `GET /login` - Login form page
- `GET /2fa` - 2FA verification page (requires pending login)
- `GET /auth/status` - Returns current authentication state (JSON)
- `GET /api/data` - JSON API endpoint
- `GET /api/unreliable` - Unreliable API endpoint (50% error rate)
- `GET /api/slow` - Slow API endpoint (1-6s delay)

### auth
- `POST /login` - Handle login form submission (redirects to `/` on success)
- `POST /verify-2fa` - Verify 2FA code (redirects to `/` on success)
- `GET /logout` - Logout and destroy session (redirects to `/`)

