const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { rateLimit } = require('express-rate-limit');
const expressHandleBars = require('express-handlebars');

require('dotenv').config();

const { dbConnection } = require('./src/config/dbConnection');
const publicRoutes = require('./src/routes/public');

const app = express();
app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 100, // Limit each IP to 100 requests per 'window'(5 minutes).
    standardHeaders: 'draft-7', // draft-6: 'RateLimit-*' headers; draft-7: combined 'RateLimit' header
    legacyHeaders: false, // Disable the 'X-RateLimit-*' headers.
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '100MB' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true }));

app.use(express.static('public'));
const hbs = expressHandleBars.create({
  helpers: {
    isEqual: (value1, value2, options) => {
      if (value1 === value2) return options.fn(this);
      else return options.inverse(this);
    },
    json: (value, options) => JSON.stringify(value),
  },
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');
app.enable('view cache');

app.use('/', publicRoutes);

dbConnection();

module.exports = app;
