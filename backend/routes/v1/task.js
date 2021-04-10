'use strict';

const router = require('express').Router({ mergeParams: true });
const operations = require('../../utilities/operations/op_task');

router.post('/', operations.addTask);

router.post('/moveTasks', operations.moveTasks);

router
  .route('/:taskID')
  .put(operations.updateTask)
  .delete(operations.deleteTask);

router.put('/:taskID/complete', operations.completeTask);

module.exports = router;
