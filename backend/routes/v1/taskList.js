'use strict';

const router = require('express').Router({ mergeParams: true });
const operations = require('../../utilities/operations/op_taskList');

router.post('/', operations.addTaskList);

router.get('/', operations.getTaskList);

router.delete('/:taskListID', operations.deleteTaskList);

module.exports = router;
