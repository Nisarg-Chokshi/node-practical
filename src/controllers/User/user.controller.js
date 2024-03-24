const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();

const { Users } = require('../../models/User');
const { MESSAGE, SALT_ROUNDS, USER_ROLES } = require('../../helpers/constants');
const { successResponse, errorResponse } = require('../../helpers/functions');

module.exports = {
  isUserLoggedIn: async (req, res, next) => {
    const token = req.cookies.appSession;
    if (token) {
      try {
        const decoded = jsonwebtoken.verify(token, process.env.SECRET);
        const { id, role } = decoded;

        const userData = await Users.findOne(
          { _id: id, role },
          { password: 0 }
        ).lean();
        if (!userData) return errorResponse(res, 401, MESSAGE.UNAUTHORIZED);

        req.user = userData;

        return next();
      } catch (error) {
        return errorResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
      }
    } else {
      return errorResponse(res, 401, MESSAGE.UNAUTHORIZED);
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const { role } = req.user;
      if (role !== USER_ROLES.ADMIN)
        return errorResponse(res, 403, MESSAGE.PERMISSON_DENIED);

      const userList = await Users.find(
        { role: USER_ROLES.USER },
        { password: 0 }
      ).lean();

      return successResponse(
        res,
        userList.length > 0 ? 200 : 204,
        MESSAGE.RESOURCE_RETRIEVED,
        userList
      );
    } catch (error) {
      console.log('userRegistration | Internal Error =>', error);
      return errorResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
    }
  },
  userRegistration: async (req, res) => {
    try {
      const {
        userName,
        email,
        password,
        gender,
        role,
        contactNumber,
        profilePic,
      } = req.body;

      const emailExists = await Users.findOne({ email }).lean();
      if (emailExists) {
        console.log('userRegistration | User with same email already exists');
        return errorResponse(res, 400, MESSAGE.RESOURCE_EXISTS);
      }

      const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);

      const newUser = await Users.create({
        userName,
        email,
        password: passwordHash,
        gender,
        role,
        contactNumber: contactNumber || '',
        profilePic: profilePic || '',
        isVerified: false,
        deleted: false,
      });

      const userData = await Users.findByIdAndUpdate(newUser._id, {
        lastLogin: new Date(),
      }).lean();

      const token = jsonwebtoken.sign(
        { id: userData._id, role },
        process.env.SECRET,
        { expiresIn: process.env.TOKEN_VALIDITY }
      );

      res.cookie('appSession', token, {
        expires: new Date(
          Date.now() + process.env.TOKEN_VALIDITY * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      });

      delete userData.password;
      return successResponse(res, 201, MESSAGE.RESOURCE_CREATED, userData);
    } catch (error) {
      console.log('userRegistration | Internal Error =>', error);
      return errorResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
    }
  },
  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const userData = await Users.findOne({ email, deleted: false }).lean();
      if (!userData) {
        console.log('userLogin | User not found');
        return errorResponse(res, 404, MESSAGE.RESOURCE_NOT_FOUND);
      } else {
        const isPasswordMatched = bcrypt.compareSync(
          password,
          userData.password
        );

        if (!isPasswordMatched) {
          console.log('userLogin | Incorrect Password');
          return errorResponse(res, 401, MESSAGE.UNAUTHORIZED);
        } else {
          await Users.findByIdAndUpdate(userData._id, {
            lastLogin: new Date(),
          });

          const token = jsonwebtoken.sign(
            { id: userData._id, role: userData.role },
            process.env.SECRET,
            { expiresIn: process.env.TOKEN_VALIDITY }
          );

          res.cookie('appSession', token, {
            expires: new Date(
              Date.now() + process.env.TOKEN_VALIDITY * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          });

          return successResponse(
            res,
            200,
            MESSAGE.RESOURCE_RETRIEVED,
            userData
          );
        }
      }
    } catch (error) {
      console.log('userLogin | Internal Error =>', error);
      return errorResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
    }
  },
  userLogout: async (req, res) => {
    res.cookie('appSession', '', {
      expires: new Date(Date.now() - 2 * 1000),
      httpOnly: true,
    });
    return successResponse(res, 200, MESSAGE.RESOURCE_RETRIEVED, {}, 200);
  },
  changePassword: async (req, res) => {
    try {
      const { email, oldPassword, newPassword } = req.body;
      const userData = await Users.findOne(
        { email, deleted: false },
        { password: 0 }
      ).lean();

      if (!userData) {
        console.log('changePassword | User not found');
        return errorResponse(res, 404, MESSAGE.RESOURCE_NOT_FOUND);
      } else {
        const isPasswordMatched = bcrypt.compareSync(
          oldPassword,
          userData.password
        );

        if (!isPasswordMatched) {
          console.log('changePassword | Incorrect Old Password');
          return errorResponse(res, 403, MESSAGE.INVALID_LOGIN);
        } else {
          const passwordHash = bcrypt.hashSync(newPassword, SALT_ROUNDS);

          await Users.findByIdAndUpdate(userData._id, {
            password: passwordHash,
          });
          return successResponse(res, 200, MESSAGE.RESOURCE_UPDATED, userData);
        }
      }
    } catch (error) {
      console.log('changePassword | Internal Error =>', error);
      return errorResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { email, password } = req.body;
      const userData = await Users.findOne(
        { email, deleted: false },
        { password: 0 }
      ).lean();

      if (!userData) {
        console.log('resetPassword | User not found');
        return errorResponse(res, 404, MESSAGE.RESOURCE_NOT_FOUND);
      } else {
        const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
        await Users.findByIdAndUpdate(userData._id, { password: passwordHash });
        return successResponse(res, 200, MESSAGE.RESOURCE_UPDATED, userData);
      }
    } catch (error) {
      console.log('resetPassword | Internal Error =>', error);
      return errorResponse(res, 500, MESSAGE.SOMETHING_WENT_WRONG);
    }
  },
};
