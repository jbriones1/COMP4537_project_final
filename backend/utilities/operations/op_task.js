const sql = require('../db');
const { getUserFromToken } = require('../token');

/**
 * Adds a task.
 *
 * 201: success
 * 400: invalid body
 * 500: database error
 *
 * @param {Object} req request
 * @param {Object} res result
 * @returns status code
 */
const addTask = (req, res) => {
  const { taskName, taskDescription, isComplete, taskListID } = req.body;

  if (
    !taskName ||
    typeof taskName !== 'string' ||
    !taskDescription ||
    typeof taskDescription !== 'string' ||
    isComplete == null ||
    typeof isComplete !== 'boolean' ||
    taskListID == null ||
    typeof taskListID !== 'number'
  ) {
    return res.sendStatus(400);
  }

  const query = `INSERT INTO task SET ?`;

  sql.db
    .query(query, [
      {
        taskName,
        taskDescription,
        isComplete,
        taskListID,
      },
    ])
    .then((result) => {
      sql.incrementEndpoint(4);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

/**
 * Mark a task complete.
 *
 * 200: success
 * 400: invalid taskID
 * 404: task not found
 * 500: database error
 *
 * @param {Object} req request
 * @param {Object} res result
 * @returns status code
 */
const completeTask = (req, res) => {
  if (req.params.taskID == null || !parseInt(req.params.taskID))
    return res.sendStatus(400);

  const query = `UPDATE task
     SET isComplete=1
     WHERE taskID=?`;

  sql.db
    .query(query, [req.params.taskID])
    .then(([result]) => {
      if (result.affectedRows < 1) return res.sendStatus(404);

      sql.incrementEndpoint(44);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

/**
 * Delete a task.
 *
 * 200: success
 * 400: invalid taskID
 * 404: task not found
 * 500: database error
 *
 * @param {Object} req request
 * @param {Object} res result
 * @returns status code
 */
const deleteTask = (req, res) => {
  if (req.params.taskID == null || !parseInt(req.params.taskID))
    return res.sendStatus(400);

  const query = `DELETE FROM task
     WHERE taskID = ?`;

  sql.db
    .query(query, [req.params.taskID])
    .then(([result, _]) => {
      if (result.affectedRows < 1) return res.sendStatus(404);

      sql.incrementEndpoint(34);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

/**
 * Moves all the incomplete tasks of the current day to the next day.
 * Makes a new task list and removes incomplete tasks from the date supplied.
 *
 * 200: success
 * 400: invalid body
 * 404: no current task list found
 * 500: database error
 *
 * @param {Object} req request
 * @param {Object} res result
 * @returns status code
 */
const moveTasks = async (req, res) => {
  const { date } = req.query;

  if (!date || typeof date !== 'string') return res.sendStatus(400);

  // Checks that the date is valid
  // Valid dates can be YYYY/MM/DD or YYYY-MM-DD
  if (new Date(date).getTime() !== new Date(date).getTime())
    return res.sendStatus(400);

  try {
    const { userID } = await getUserFromToken(req.token);

    if (userID == null) return res.sendStatus(400);

    // Find the task list for the current day
    const q1 = `SELECT taskListID
       FROM taskList
       WHERE userID = ?
             AND date = ?`;

    const [result1] = await sql.db.query(q1, [userID, date]);

    // If there is no task list for today, return a 404
    if (result1.length < 1) return res.sendStatus(404);

    const currTaskListID = result1[0].taskListID;

    // Create a taskList for the next day
    const nextDate = addDay(date);
    const q2 = `INSERT INTO taskList
        SET ?`;

    const [result2] = await sql.db.query(q2, [{ userID, date: nextDate }]);
    const newTaskListID = result2.insertId;

    // Set all incomplete tasks for today to tomorrow
    const q3 = `UPDATE task
       SET taskListID = ?
       WHERE taskListID = ? 
             AND isComplete = 0`;

    await sql.db.query(q3, [newTaskListID, currTaskListID]);

    sql.incrementEndpoint(14);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

/**
 * Adds a day to the date passed in.
 *
 * @param {String} date format YYYY-MM-DD
 * @returns string of next date in format YYYY-MM-DD
 */
const addDay = (date) => {
  // Creates a date from the string
  const currDate = new Date(date);

  // Adds a day
  const nextDate = new Date(currDate.setDate(currDate.getDate() + 1));

  // Returns the ISO date without the time
  return nextDate.toISOString().split('T')[0];
};

/**
 * Changes the task's name, description and completion status.
 *
 * 200: success
 * 400: invalid body
 * 404: no matching task found
 * 500: database error
 *
 * @param {Object} req request
 * @param {Object} res result
 * @returns status code
 */
const updateTask = (req, res) => {
  // Check if the taskID is there
  const taskID = req.params.taskID;
  if (taskID == null || !parseInt(taskID)) return res.sendStatus(400);

  // Check that a proper body was sent
  const { taskName, taskDescription, isComplete } = req.body;
  if (!taskName || !taskDescription || isComplete == null)
    return res.sendStatus(400);

  // Change the task based on the body data
  const query = `UPDATE task
     SET taskName = ?,
         taskDescription = ?,
         isComplete = ?
     WHERE taskID = ?`;

  sql.db
    .query(query, [taskName, taskDescription, isComplete, taskID])
    .then(([result]) => {
      // If no task matches the taskID, send a 404
      if (result.affectedRows < 1) return res.sendStatus(404);

      sql.incrementEndpoint(24);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

module.exports = {
  addTask,
  completeTask,
  deleteTask,
  moveTasks,
  updateTask,
};
