const express = require('express');

const router = express.Router();

const controllers = require('../Controllers/auth');
const validator = require('../middleware/password-validator');

router.post('/signup', validator, controllers.signup);

router.post('/login', controllers.login);

module.exports = router;