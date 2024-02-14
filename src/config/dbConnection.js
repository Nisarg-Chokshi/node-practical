const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
  dbConnection: async () => {
    try {
      await mongoose.connect(process.env.DATABASE_URL);
      console.log('Successfully connected to Database');
    } catch (error) {
      console.warn('Error connecting to Database =>', error);
      process.exit(1);
    }
  },
};
