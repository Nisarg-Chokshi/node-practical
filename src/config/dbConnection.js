const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
  dbConnection: async () => {
    try {
      await mongoose.connect(process.env.DATABASE_URL);
      console.log('dbConnection | Successfully connected to Database');
    } catch (error) {
      console.warn('dbConnection | Error connecting to Database =>', error);
      process.exit(1);
    }
  },
};
