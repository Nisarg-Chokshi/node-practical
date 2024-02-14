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
  acceptTicket,
  rejectTicket,
} = require('../controllers/User/user.controller');

const {
  registerSchema,
  loginSchema,
} = require('../controllers/User/user.validator');

const { USER_ROLES } = require('../helpers/constants');

const router = express.Router();

// ------------------------------
//      API Calls
// ------------------------------
router.post('/api/register', validatePayload(registerSchema), userRegistration);

router.post('/api/login', validatePayload(loginSchema), userLogin);

router.post('/api/createTicket', isUserLoggedIn, ticketCreation);

router.post('/api/acceptTicket', isUserLoggedIn, acceptTicket);

router.post('/api/rejectTicket', isUserLoggedIn, rejectTicket);

// ------------------------------
//        Rendering Views
// ------------------------------

router.get('/', isUserLoggedIn, (req, res) => {
  console.log('/ | req.user =>', req.user);
  if (req.user) res.render('dashboard', { userData: req.user });
  else res.render('dashboard');
});

router.get('/register', isUserLoggedIn, (req, res) => {
  if (req.url !== '/register') res.redirect('/register');
  console.log('/register | req.user =>', req.user);
  if (req.user) res.redirect('/');
  else res.render('register');
});

router.get('/login', isUserLoggedIn, (req, res) => {
  console.log('/login | req.user =>', req.user);
  if (req.user) res.render('/');
  else res.render('login');
});

router.get('/logout', userLogout);

router.get('/viewTickets', isUserLoggedIn, async (req, res) => {
  console.log('/viewTickets | req.user =>', req.user);
  res.render('viewTickets', { userData: req.user, ticketData: req.ticketData });
});

router.get(
  '/createTicket',
  isUserLoggedIn,
  checkRole(USER_ROLES.CLIENT),
  (req, res) => {
    console.log('/createTicket | req.user =>', req.user);
    res.render('createTicket', { userData: req.user });
  }
);

router.get('/*', isUserLoggedIn, (req, res) => {
  res.redirect('/');
});

module.exports = router;
