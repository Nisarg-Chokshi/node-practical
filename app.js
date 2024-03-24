const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { rateLimit } = require('express-rate-limit');

require('dotenv').config();

const { dbConnection, addDocuments } = require('./src/config/dbConnection');
const routes = require('./src/routes/routes');

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

app.use('/', routes);

dbConnection();
// addDocuments();

module.exports = app;
