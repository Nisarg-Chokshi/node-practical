const express = require('express');

const { validatePayload } = require('./../middleware/requestValidator');

const {
  userRegistration,
  userLogin,
  userLogout,
  isUserLoggedIn,
  getAllUsers,
} = require('../controllers/User/user.controller');

const {
  addProduct,
  getAllProducts,
  updateProductStatus,
  getAvgOrderValue,
  getTotalRevenue,
  getBestSellingProducts,
  getAllSales,
  addTransaction,
} = require('../controllers/Product/product.controller');

const {
  registerSchema,
  loginSchema,
} = require('../controllers/User/user.validator');

const {
  addProductSchema,
  updateProductStatusSchema,
} = require('../controllers/Product/product.validator');

const router = express.Router();

router.post('/api/users', validatePayload(registerSchema), userRegistration);

router.get('/api/users', isUserLoggedIn, getAllUsers);

router.post('/api/login', validatePayload(loginSchema), userLogin);

router.post('/api/logout', isUserLoggedIn, userLogout);

router.post(
  '/api/products',
  isUserLoggedIn,
  validatePayload(addProductSchema),
  addProduct
);

router.get('/api/products', isUserLoggedIn, getAllProducts);

router.patch(
  '/api/updateProductStatus',
  isUserLoggedIn,
  validatePayload(updateProductStatusSchema),
  updateProductStatus
);

router.post('/api/transaction', isUserLoggedIn, addTransaction);

router.get('/api/totalRevenue', isUserLoggedIn, getTotalRevenue);

router.get('/api/avgOrderValue', isUserLoggedIn, getAvgOrderValue);

router.get('/api/bestSellingProducts', isUserLoggedIn, getBestSellingProducts);

router.get('/api/sales', isUserLoggedIn, getAllSales);

module.exports = router;
