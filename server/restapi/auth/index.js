const express = require('express');

const router = express.Router();
const passport = require('passport');
const dotenv = require('dotenv');
const url = require('url');
const querystring = require('querystring');
const protect = require('./protect');

dotenv.config();

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', (req, res, next) => { return res.redirect(req.query.returnTo);
  if (!req.session.returnTo) {
    req.session.returnTo = req.query.returnTo || req.originalUrl;
  }

  next();
}, passport.authenticate('auth0', {
  scope: 'openid email profile'
}), (req, res) => {
  res.redirect('/');
});

router.get('/user', protect(), (req, res) => {
  res.json(req.user);
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', (req, res, next) => {
  passport.authenticate('auth0', (err, user) => {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/api/v1/login'); }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      const { returnTo } = req.session;
      delete req.session.returnTo;
      res.redirect(returnTo || '/');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();
  let returnTo = req.query.returnTo || (`${req.protocol}://${req.hostname}`);
  const port = req.connection.localPort;
  if (!req.query.returnTo && port !== undefined && port !== 80 && port !== 443) {
    returnTo += `:${port}`;
  }

  const logoutURL = new url.URL(
    `https://${process.env.AUTH0_DOMAIN}/v2/logout`
  );

  logoutURL.search = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo
  });

  res.redirect(logoutURL);
});


module.exports = router;
