const app = require('./app');

app.listen(process.env.APP_PORT, () => {
  console.log('-------------------------START----------------------------');
  console.log(
    `Process ${process.pid} is listening to all incoming requests on ${process.env.APP_PORT}`
  );
  console.log('----------------------------------------------------------');
});
