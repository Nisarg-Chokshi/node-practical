const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();

const { Users } = require('../../models/User');
const {
  MESSAGE,
  SALT_ROUNDS,
  USER_ROLES,
  TICKET_STATUS,
} = require('../../helpers/constants');
const { Tickets } = require('../../models/Ticket');

module.exports = {
  isUserLoggedIn: async (req, res, next) => {
    const token = req.cookies.appSession;
    if (token) {
      try {
        const decoded = jsonwebtoken.verify(token, process.env.SECRET);
        const { id, role } = decoded;

        const userData = await Users.findOne({ _id: id, role });
        if (!userData) {
          console.log('User Not found');
          return next();
          // res.render('login', { errorMessage: MESSAGE.RESOURCE_NOT_FOUND });
        }

        req.user = userData;
        return next();
      } catch (error) {
        console.log('Error in auth =>', error);
        return next();
        // res.render('login');
      }
    } else {
      next();
      // res.render('login');
    }
  },
  userRegistration: async (req, res) => {
    try {
      const {
        userName,
        email,
        password,
        contactNumber,
        profilePic,
        verifyToken,
        isVerified,
        role,
        lastLogin,
      } = req.body;

      const emailExists = await Users.findOne({ email });
      if (emailExists) {
        console.log('userRegistration | User with same email already exists');
        res.render('register', { errorMessage: MESSAGE.RESOURCE_EXISTS });
      }

      const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);

      const newUser = await Users.create({
        userName,
        email,
        password: passwordHash,
        contactNumber: contactNumber || '',
        profilePic: profilePic || '',
        verifyToken: verifyToken || '',
        isVerified: false,
        role,
        deleted: false,
      });

      const userData = await Users.findByIdAndUpdate(newUser._id, {
        lastLogin: new Date(),
      }).lean();

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

      delete userData.password;

      res.render('dashboard', { userData });
    } catch (error) {
      console.log('userRegistration | Internal Error =>', error);
      res.render('register', {
        errorMessage: MESSAGE.SOMETHING_WENT_WRONG,
      });
    }
  },
  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const userData = await Users.findOne({ email, deleted: false }).lean();
      if (!userData) {
        console.log('userLogin | User not found');
        res.render('login', { errorMessage: MESSAGE.RESOURCE_NOT_FOUND });
      } else {
        const isPasswordMatched = bcrypt.compareSync(
          password,
          userData.password
        );

        if (!isPasswordMatched) {
          console.log('userLogin | Incorrect Password');
          res.render('login', { errorMessage: MESSAGE.INVALID_LOGIN });
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

          delete userData.password;

          res.render('dashboard', { userData });
        }
      }
    } catch (error) {
      console.log('userLogin | Internal Error =>', error);
      res.render('login', { errorMessage: MESSAGE.SOMETHING_WENT_WRONG });
    }
  },
  userLogout: async (req, res) => {
    res.cookie('appSession', '', {
      expires: new Date(Date.now() - 2 * 1000),
      httpOnly: true,
    });
    res.redirect('/');
  },
  changePassword: async (req, res) => {
    try {
      const { email, oldPassword, newPassword } = req.body;
      const userData = await Users.findOne({ email, deleted: false }).lean();

      if (!userData) {
        console.log('changePassword | User not found');
        res.render('changePassword', {
          errorMessage: MESSAGE.RESOURCE_NOT_FOUND,
        });
      } else {
        const isPasswordMatched = bcrypt.compareSync(
          oldPassword,
          userData.password
        );

        if (!isPasswordMatched) {
          console.log('changePassword | Incorrect Old Password');
          res.render('changePassword', {
            errorMessage: MESSAGE.INVALID_LOGIN,
          });
        } else {
          const passwordHash = bcrypt.hashSync(newPassword, SALT_ROUNDS);

          await Users.findByIdAndUpdate(userData._id, {
            password: passwordHash,
          });
          res.render('dashboard', {
            alertMessage: MESSAGE.PASSWORD_UPDATED,
          });
        }
      }
    } catch (error) {
      console.log('changePassword | Internal Error =>', error);
      res.render('changePassword', {
        errorMessage: MESSAGE.SOMETHING_WENT_WRONG,
      });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { email, password } = req.body;
      const userData = await Users.findOne({ email, deleted: false });

      if (!userData) {
        console.log('resetPassword | User not found');
        res.render('resetPassword', {
          errorMessage: MESSAGE.RESOURCE_NOT_FOUND,
        });
      } else {
        const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
        await Users.findByIdAndUpdate(userData._id, { password: passwordHash });
        res.render('dashboard', {
          alertMessage: MESSAGE.PASSWORD_UPDATED,
        });
      }
    } catch (error) {
      console.log('resetPassword | Internal Error =>', error);
      res.render('resetPassword', {
        errorMessage: MESSAGE.SOMETHING_WENT_WRONG,
      });
    }
  },
  getAllTickets: async (req, res) => {
    try {
      const { _id, role } = req.body;

      const userExists = await Users.findById({ _id }).lean();
      if (!userExists) {
        console.log('getAllTickets | User not found');
        res.render('viewTickets', { errorMessage: MESSAGE.RESOURCE_NOT_FOUND });
      }

      let ticketData = [];

      if (userExists.role === USER_ROLES.EMPLOYEE) {
        ticketData = await Tickets.find({
          status: {
            $in: [TICKET_STATUS.PENDING, TICKET_STATUS.REJECTED_BY_MANAGER],
          },
        });
      } else if (userExists.role === USER_ROLES.MANAGER) {
        ticketData = await Tickets.find({
          status: {
            $in: [
              TICKET_STATUS.APPROVED_BY_EMPLOYEE,
              TICKET_STATUS.REJECTED_BY_ADMIN,
            ],
          },
        });
      } else if (userExists.role === USER_ROLES.ADMIN) {
        ticketData = await Tickets.find({});
      } else if (userExists.role === USER_ROLES.CLIENT) {
        ticketData = await Tickets.find({
          status: TICKET_STATUS.APPROVED_BY_ADMIN,
        });
      }

      res.render('viewTickets', { ticketData });
    } catch (error) {
      console.log('getAllTickets | Internal Error =>', error);
      res.render('createTicket', {
        errorMessage: MESSAGE.SOMETHING_WENT_WRONG,
      });
    }
  },
  ticketCreation: async (req, res) => {
    try {
      const { title, description, images, videos, remarks } = req.body;
      const generatedBy = req.user._id;

      const userExists = await Users.findById({ _id: generatedBy });
      if (!userExists) {
        console.log('ticketCreation | User not found');
        res.render('createTicket', {
          errorMessage: MESSAGE.RESOURCE_NOT_FOUND,
        });
      }

      if (req.user.role !== 'Client') {
        console.log('ticketCreation', req.user.role, 'can not create tickets');
        res.render('createTicket', { errorMessage: MESSAGE.UNAUTHORIZED });
      }

      const newTicket = await Tickets.create({
        generatedBy,
        content: { title, description, images, videos },
        remarks,
        status: 'Pending',
        history: [],
      });

      const ticketData = await Tickets.find({}).lean();
      res.render('viewTickets', { ticketData });
    } catch (error) {
      console.log('ticketCreation | Internal Error =>', error);
      res.render('createTicket', {
        errorMessage: MESSAGE.SOMETHING_WENT_WRONG,
      });
    }
  },
};
