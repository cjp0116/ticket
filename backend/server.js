const app = require("./app");

app.listen(process.env.PORT || 5000, e => {
  console.log('Server starting on port 5000');
})

