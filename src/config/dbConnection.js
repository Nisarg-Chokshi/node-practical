const mongoose = require('mongoose');
const {
  addDefaultUsers,
  addDefaultProducts,
  addDefaultSales,
  addDefaultRevenues,
} = require('../migrations/Users');
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
  addDocuments: async () => {
    try {
      await addDefaultUsers();
      console.log('addDocuments | Successfully added users documents');
      await addDefaultProducts();
      console.log('addDocuments | Successfully added products documents');
      await addDefaultSales();
      console.log('addDocuments | Successfully added sales documents');
      await addDefaultRevenues();
      console.log('addDocuments | Successfully added revenues documents');
    } catch (error) {
      console.warn('addDocuments | Error adding documents =>', error);
      process.exit(1);
    }
  },
};
