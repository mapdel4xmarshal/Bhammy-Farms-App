process.env.DEBUG = 'bhammy*';

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
const houses = require('./restapi/houses/routes');
const batches = require('./restapi/batches/routes');
const parties = require('./restapi/parties/routes');
const expenses = require('./restapi/expenses/routes');
const items = require('./restapi/items/routes');
const invoices = require('./restapi/invoices/routes');
const activities = require('./restapi/activities/routes');
const production = require('./restapi/production/routes');
const feedProduction = require('./restapi/feedProduction/routes');
const employees = require('./restapi/employees/routes');
const damagedItems = require('./restapi/damagedItems/routes');
const notifications = require('./restapi/notifications/routes');
const WeatherMonitor = require('./weatherMonitor');

// Bots
const FeedMillBot = require('./restapi/feedProduction/bot');

new FeedMillBot().listen();

const weatherMonitor = new WeatherMonitor();
weatherMonitor.monitor();

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
}

app.use('/api/v1', auth);

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
app.use('/api/v1/feed-productions', protect(), feedProduction);
app.use('/api/v1/activity-logs', protect(), activityLogs);
app.use('/api/v1/houses', protect(), houses);
app.use('/api/v1/damaged-items', protect(), damagedItems);
app.use('/api/v1/employees', protect({
  skip: '/webhook/salary'
}), employees);
app.use('/api/v1/notifications', protect({
  skip: '/payment'
}), notifications);

app.get('*', (req, res) => {
  res.sendFile(path.resolve('../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Bhammy Farms App running on port ${port}`);
});
