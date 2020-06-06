const express = require('express');
const path = require('path');
const locations = require('./restapi/locations/routes');
const batches = require('./restapi/batches/routes');

const app = express();
const port = process.env.PORT || 8888;

// Serve all the files in '/dist' directory
app.use(express.static(path.resolve(__dirname, '../dist')));

app.use('/api/v1/locations', locations);
app.use('/api/v1/batches', batches);

app.listen(port, () => {
  console.log(`Bhammy Farms App running on port ${port}`);
});
