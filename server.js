const express = require('express');
const routes = require('./routes');

const port = process.env.PORT || 5000;
const app = express();

// load all routes from the file routes/index.js
// express middle ware to use json
app.use(express.json());
app.use('/', routes);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
export default app;
