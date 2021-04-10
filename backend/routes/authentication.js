'use strict';
const router = require('express').Router();

const operations = require('../utilities/login');

router.post('/login', operations.login);
router.post('/user', operations.register);
router.post('/token', operations.refresh);
router.delete('/logout', operations.logout);

module.exports = router;
