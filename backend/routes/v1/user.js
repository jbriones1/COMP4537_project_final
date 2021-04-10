'use strict';

const operation = require('../../utilities/operations/op_user.js');
const router = require('express').Router({ mergeParams: true });

router.get('/', operation.getUserByID);

module.exports = router;
