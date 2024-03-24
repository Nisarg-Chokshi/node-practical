require('dotenv').config();

const { Users } = require('../../models/User');
const { Products } = require('../../models/Product');
const { Sales } = require('../../models/Sale');
const { Revenues } = require('../../models/Revenue');
const { MESSAGE, STATUS, USER_ROLES } = require('../../helpers/constants');
const { successResponse, errorResponse } = require('../../helpers/functions');

module.exports = {
  getAllProducts: async (req, res) => {
    try {
      const productData = await Products.find({
        status: STATUS.AVAILABLE,
      });
      return successResponse(
        res,
        productData.length > 0 ? 200 : 204,
        MESSAGE.RESOURCE_RETRIEVED,
        productData
      );
    } catch (error) {
      console.log('getAllProducts | Internal Error =>', error);
      return errorResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
    }
  },
  addProduct: async (req, res) => {
    try {
      const { _id, role } = req.user;
      if (role !== USER_ROLES.ADMIN)
        return errorResponse(res, 403, MESSAGE.PERMISSON_DENIED);

      const {
        name,
        description,
        category,
        images,
        price,
        availableQuantity,
        quantitySold,
      } = req.body;

      const userExists = await Users.findById({ _id });
      if (!userExists) {
        console.log('addProduct | User not found');
        return errorResponse(res, 404, MESSAGE.RESOURCE_NOT_FOUND);
      }

      const productExists = await Products.findOne({ name });
      if (productExists) {
        console.log('addProduct | Product already exists');
        return errorResponse(res, 404, MESSAGE.RESOURCE_EXISTS);
      }

      const newProduct = await Products.create({
        name,
        description,
        category,
        images,
        price,
        status: STATUS.AVAILABLE,
        availableQuantity,
        quantitySold: quantitySold || 0,
        generatedBy: _id,
      });

      return successResponse(res, 201, MESSAGE.RESOURCE_CREATED, newProduct);
    } catch (error) {
      console.log('addProduct | Internal Error =>', error);
      return errorResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
    }
  },
  updateProductStatus: async (req, res) => {
    try {
      const { role } = req.user;
      if (role !== USER_ROLES.ADMIN)
        return errorResponse(res, 403, MESSAGE.PERMISSON_DENIED);

      const { id, status } = req.body;
      const product = await Products.findById({ _id: id });
      if (!product) {
        console.log('updateProductStatus | Product not found');
        return errorResponse(res, 404, MESSAGE.RESOURCE_NOT_FOUND);
      } else {
        const userData = await Users.findById({ _id: req.user._id }).lean();
        if (!userData) {
          console.log('updateProductStatus | User not found');
          return errorResponse(res, 404, MESSAGE.RESOURCE_NOT_FOUND);
        } else {
          product.status = status;
          await product.save();
          return successResponse(res, 201, MESSAGE.RESOURCE_UPDATED, {
            ...product._doc,
            status,
          });
        }
      }
    } catch (error) {
      console.log('updateProductStatus | Internal Error =>', error);
      return errorResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
    }
  },
  addTransaction: async (req, res) => {
    try {
      const { id, quantity, price, customerId } = req.body;
      const product = await Products.findById({ _id: id });
      if (!product) {
        console.log('addTransaction | Product not found');
        return errorResponse(res, 404, MESSAGE.RESOURCE_NOT_FOUND);
      }
      if (product.availableQuantity < quantity) {
        console.log('addTransaction | Not Enough Quantity Available');
        return errorResponse(res, 400, MESSAGE.RESOURCE_NOT_FOUND);
      }

      const transaction = new Sales({
        productId: id,
        quantity,
        price: price * quantity,
        customer: customerId,
        date: new Date(),
      });
      await transaction.save();

      product.availableQuantity -= quantity;
      product.quantitySold += quantity;
      if (product.availableQuantity === 0) product.status = 'Out of Stock';
      await product.save();

      const month = new Date().getUTCMonth();
      const year = new Date().getUTCFullYear();

      const revenueData = await Revenues.findOne({ month, year });
      if (!revenueData) {
        console.log('addTransaction | Revenue record not found');
        const monthlyRevenue = new Revenues({
          month,
          year,
          totalRevenue: price * quantity,
        });
        await monthlyRevenue.save();
      } else {
        revenueData.totalRevenue += price * quantity;
        await revenueData.save();
      }

      return successResponse(res, 201, MESSAGE.RESOURCE_CREATED, transaction);
    } catch (error) {
      console.log('addTransaction | Internal Error =>', error);
      return errorResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
    }
  },
  getTotalRevenue: async (req, res) => {
    try {
      const { role } = req.user;
      if (role !== USER_ROLES.ADMIN)
        return errorResponse(res, 403, MESSAGE.PERMISSON_DENIED);

      const data = await Sales.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: { $multiply: ['$price', '$quantity'] } },
          },
        },
      ]);

      return successResponse(
        res,
        200,
        MESSAGE.RESOURCE_RETRIEVED,
        data[0].totalRevenue
      );
    } catch (error) {
      console.log('getTotalRevenue | Internal Error =>', error);
      return errorResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
    }
  },
  getAvgOrderValue: async (req, res) => {
    try {
      const { role } = req.user;
      if (role !== USER_ROLES.ADMIN)
        return errorResponse(res, 403, MESSAGE.PERMISSON_DENIED);

      const data = await Sales.aggregate([
        {
          $group: {
            _id: null,
            avgOrderValue: { $avg: { $multiply: ['$price', '$quantity'] } },
          },
        },
      ]);
      return successResponse(
        res,
        200,
        MESSAGE.RESOURCE_RETRIEVED,
        data[0].avgOrderValue
      );
    } catch (error) {
      console.log('getAvgOrderValue | Internal Error =>', error);
      return errorResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
    }
  },
  getBestSellingProducts: async (req, res) => {
    try {
      const { limit = 10 } = req.query;

      const bestSellingProducts = await Products.find()
        .sort({ quantitySold: -1 })
        .limit(limit);

      return successResponse(
        res,
        200,
        MESSAGE.RESOURCE_RETRIEVED,
        bestSellingProducts
      );
    } catch (error) {
      console.log('getBestSellingProducts | Internal Error =>', error);
      return errorResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
    }
  },
  getAllSales: async (req, res) => {
    try {
      const { role } = req.user;
      if (role !== USER_ROLES.ADMIN)
        return errorResponse(res, 403, MESSAGE.PERMISSON_DENIED);

      const salesData = await Sales.find({});
      return successResponse(
        res,
        salesData.length > 0 ? 200 : 204,
        MESSAGE.RESOURCE_RETRIEVED,
        salesData
      );
    } catch (error) {
      console.log('getAllSales | Internal Error =>', error);
      return errorResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
    }
  },
  getMonthlyRevenue: async (req, res) => {
    try {
      const { role } = req.user;
      if (role !== USER_ROLES.ADMIN)
        return errorResponse(res, 403, MESSAGE.PERMISSON_DENIED);

      const monthlyRevenue = await Revenues.aggregate([
        { $group: { _id: { $month: '$date' }, revenue: { $sum: '$amount' } } },
        { $project: { _id: 0, month: '$_id', revenue: 1 } },
        { $sort: { month: 1 } },
      ]);

      res.json(monthlyRevenue);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};
