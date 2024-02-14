const express = require('express');

const {
  validatePayload,
  checkRole,
} = require('./../middleware/requestValidator');

const {
  userRegistration,
  userLogin,
  userLogout,
  isUserLoggedIn,
  ticketCreation,
  getAllTickets,
} = require('../controllers/User/user.controller');
const {
  registerSchema,
  loginSchema,
  generateTicketSchema,
} = require('../controllers/User/user.validator');
const { USER_ROLES } = require('../helpers/constants');

const router = express.Router();

router.get('/', isUserLoggedIn, (req, res) => {
  res.render('dashboard', { userData: req.user });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/logout', userLogout);

router.get('/viewTickets', isUserLoggedIn, async (req, res) => {
  const ticketData = await getAllTickets(req, res);
  res.render('viewTickets', { ticketData });
});

router.post('/api/register', validatePayload(registerSchema), userRegistration);

router.post('/api/login', validatePayload(loginSchema), userLogin);

router.get(
  '/createTicket',
  isUserLoggedIn,
  checkRole(USER_ROLES.CLIENT),
  (req, res) => {
    res.render('createTicket');
  }
);

// router.post('/api/createTicket', validatePayload(generateTicketSchema), ticketCreation);
router.post('/api/createTicket', isUserLoggedIn, ticketCreation);

module.exports = router;
