const express = require('express');
const session = require('express-session');
const path = require('path');
const speakeasy = require('speakeasy');

const app = express();
const PORT = process.env.PORT || 8888;

// Static 2FA secret for testing (user1)
const TWO_FA_SECRET = 'JBSWY3DPEBLW64TMMQ======';  // Static secret for consistent TOTP generation

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'test-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

// Sample users for login
const USERS = {
  'user1': { password: 'password1', name: 'User One' },
  'user2': { password: 'password2', name: 'User Two' }
};

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Lightweight auth status for the frontend
app.get('/auth/status', (req, res) => {
  if (req.session.userId) {
    return res.json({
      authenticated: true,
      userId: req.session.userId,
      name: req.session.userName
    });
  }
  res.json({ authenticated: false });
});

// ============ PAGES ============

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// 2FA page
app.get('/2fa', (req, res) => {
  if (!req.session.pendingUserId) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public/2fa.html'));
});

// ============ LOGIN ROUTES ============

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (USERS[username] && USERS[username].password === password) {
    // For users that need 2FA, redirect to 2FA page
    if (username === 'user1') {
      req.session.pendingUserId = username;
      req.session.twoFACode = speakeasy.totp({
        secret: TWO_FA_SECRET,
        encoding: 'base32'
      });
      console.log(`2FA Code for ${username}: ${req.session.twoFACode}`);
      return res.redirect('/2fa');
    } else {
      // user2 logs in without 2FA
      req.session.userId = username;
      req.session.userName = USERS[username].name;
      return res.redirect('/');
    }
  }

  res.status(401).send('Invalid credentials');
});

// ============ 2FA ROUTES ============

app.post('/verify-2fa', (req, res) => {
  const { code } = req.body;

  if (!req.session.pendingUserId) {
    return res.status(400).send('No pending login');
  }

  if (code === req.session.twoFACode) {
    req.session.userId = req.session.pendingUserId;
    req.session.userName = USERS[req.session.pendingUserId].name;
    delete req.session.pendingUserId;
    delete req.session.twoFACode;
    return res.redirect('/');
  }

  res.status(401).send('Invalid 2FA code');
});

// ============ LOGOUT ============

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Could not log out');
    }
    res.redirect('/');
  });
});

// ============ API ENDPOINTS ============

// Simple JSON API
app.get('/api/data', (req, res) => {
  res.json({
    message: 'Hello from API',
    timestamp: new Date().toISOString(),
    data: {
      items: ['item1', 'item2', 'item3'],
      status: 'success'
    }
  });
});

// API that randomly returns 500 error
app.get('/api/unreliable', (req, res) => {
  const randomNum = Math.random();
  
  if (randomNum < 0.5) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'This endpoint randomly fails'
    });
  }

  res.json({
    message: 'Request succeeded',
    timestamp: new Date().toISOString()
  });
});

// API that randomly returns slow response
app.get('/api/slow', (req, res) => {
  const delay = Math.random() * 1000 + 100; // 1-6 seconds
  
  setTimeout(() => {
    res.json({
      message: 'Slow response completed',
      delay: Math.round(delay) + 'ms',
      timestamp: new Date().toISOString()
    });
  }, delay);
});

// ============ START SERVER ============

app.listen(PORT, () => {
  console.log(`Test Automation Examples Web App running on http://localhost:${PORT}`);
  console.log('\nDemo Users for testing:');
  console.log('  User 1 (with 2FA): user1 / password1');
  console.log('  User 2 (without 2FA): user2 / password2');
  console.log('\nNote: 2FA code is logged to console for testing purposes');
});
