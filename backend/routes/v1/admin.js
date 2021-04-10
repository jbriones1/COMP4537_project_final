'use strict';

const router = require('express').Router({ mergeParams: true });
const operations = require('../../utilities/operations/op_admin');

router.get('/stats', operations.getAdminStats);

module.exports = router;
