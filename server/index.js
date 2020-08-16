const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const locations = require('./restapi/locations/routes');
const batches = require('./restapi/batches/routes');
const parties = require('./restapi/parties/routes');
const expenses = require('./restapi/expenses/routes');
const items = require('./restapi/items/routes');
const invoices = require('./restapi/invoices/routes');
const activities = require('./restapi/activities/routes');
const production = require('./restapi/production/routes');

const app = express();
const port = process.env.PORT || 8888;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Serve all the files in '/dist' directory
app.use(express.static(path.resolve(__dirname, '../dist')));

// uploads
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

app.use('/api/v1/expenses', expenses);
app.use('/api/v1/locations', locations);
app.use('/api/v1/batches', batches);
app.use('/api/v1/parties', parties);
app.use('/api/v1/items', items);
app.use('/api/v1/invoices', invoices);
app.use('/api/v1/activities', activities);
app.use('/api/v1/productions', production);

app.get('*', (req, res) => {
  res.sendFile(path.resolve('../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Bhammy Farms App running on port ${port}`);
});
