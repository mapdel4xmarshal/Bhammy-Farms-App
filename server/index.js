const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const path = require('path');
const protect = require('./restapi/auth/protect');
const auth = require('./restapi/auth/index');

const activityLogs = require('./restapi/activityLogs/routes');
const locations = require('./restapi/locations/routes');
const batches = require('./restapi/batches/routes');
const parties = require('./restapi/parties/routes');
const expenses = require('./restapi/expenses/routes');
const items = require('./restapi/items/routes');
const invoices = require('./restapi/invoices/routes');
const activities = require('./restapi/activities/routes');
const production = require('./restapi/production/routes');

dotenv.config();

const app = express();
const port = process.env.PORT || 8888;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// config express-session
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true
};

app.use(session(sess));

if (app.get('env') === 'production') {
  // Use secure cookies in production (requires SSL/TLS)
  // sess.cookie.secure = true;
}

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:8888/api/v1/callback'
  },
  (accessToken, refreshToken, extraParams, profile, done) =>
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    done(null, profile)

);

passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());

// You can use this section to keep a smaller payload
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use('/api/v1', auth);
/*
// Serve all the files in '/dist' directory
app.use(express.static(path.resolve(__dirname, '../dist'))); */

// uploads
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

app.use('/api/v1/expenses', protect(), expenses);
app.use('/api/v1/locations', protect(), locations);
app.use('/api/v1/batches', protect(), batches);
app.use('/api/v1/parties', protect(), parties);
app.use('/api/v1/items', protect(), items);
app.use('/api/v1/invoices', protect(), invoices);
app.use('/api/v1/activities', protect(), activities);
app.use('/api/v1/productions', protect(), production);
app.use('/api/v1/activity-logs', protect(), activityLogs);

app.get('*', (req, res) => {
  res.sendFile(path.resolve('../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Bhammy Farms App running on port ${port}`);
});
