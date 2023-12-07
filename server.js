const express = require('express');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Load routes
app.use('/', routes);
app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app