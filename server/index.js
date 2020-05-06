const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 80;

// Serve all the files in '/dist' directory
app.use(express.static(path.resolve(__dirname, '../dist')));

app.listen(port, () => {
  console.log(`Bhammy Farms App running on port ${port}`);
});
