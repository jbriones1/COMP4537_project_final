const sql = require('../db');
const { getUserFromToken } = require('../token');

/**
 * Adds a task list.
 *
 * 201: success
 * 400: invalid body
 * 500: database error
 *
 * @param {Object} req request
 * @param {Object} res result
 * @returns status code
 */
const addTaskList = async (req, res) => {
  const { date } = req.query;

  // Checks for malformed query
  if (!date || typeof date !== 'string') return res.sendStatus(400);

  // Checks that the date is valid
  // Valid dates can be YYYY/MM/DD or YYYY-MM-DD
  if (new Date(date).getTime() !== new Date(date).getTime())
    return res.sendStatus(400);

  try {
    const { userID } = await getUserFromToken(req.token);

    if (userID == null) return res.sendStatus(400);

    const query = `INSERT INTO taskList
     SET ?`;

    sql.db
      .query(query, [{ userID, date }])
      .then((results) => {
        sql.incrementEndpoint(64);
        res.sendStatus(201);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  } catch (error) {
    console.log(err);
    res.sendStatus(500);
  }
};

/**
 * Deletes a task list.
 *
 * 200: success
 * 400: invalid parameter
 * 404: task list not found
 * 500: database error
 *
 * @param {Object} req request
 * @param {Object} res result
 * @returns status code
 */
const deleteTaskList = async (req, res) => {

  console.log(typeof parseInt(req.params.taskListID))
  if (
    req.params.taskListID == null ||
    !parseInt(req.params.taskListID)
  )
    return res.sendStatus(400);

  try {
    const q1 = `DELETE FROM task
      WHERE taskListID = ?`;

    await sql.db.query(q1, [req.params.taskListID]);

    const q2 = `DELETE from taskList
       WHERE taskListID = ?`;

    const [result] = await sql.db.query(q2, [req.params.taskListID]);

    if (result.affectedRows < 1) return res.sendStatus(404);

    sql.incrementEndpoint(84);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

/**
 * Get a task list with all its tasks.
 *
 * 200: task list with tasks
 * 400: invalid body
 * 404: task list not found
 * 500: database error
 *
 * @param {Object} req request
 * @param {Object} res result
 * @returns status code
 */
const getTaskList = async (req, res) => {
  const { date } = req.query;

  if (!date) return res.sendStatus(400);

  // Checks that the date is valid
  // Valid dates can be YYYY/MM/DD or YYYY-MM-DD
  if (new Date(date).getTime() !== new Date(date).getTime())
    return res.sendStatus(400);

  try {
    const { userID } = await getUserFromToken(req.token);

    if (userID == null) return res.sendStatus(400);

    // Find the task list and see if it exists
    const q1 = `SELECT taskListID 
       FROM taskList 
       WHERE userID = ? 
             AND date = ?`;

    const [taskList, _1] = await sql.db.query(q1, [userID, date]);

    // If the task list doesn't exist, end with 404
    if (taskList.length < 1) return res.sendStatus(404);

    // If the task list exists, find the tasks that are a part of it
    const q2 = `SELECT taskID,taskName,taskDescription,isComplete
       FROM task 
       WHERE taskListID = ?`;

    const [tasks, _2] = await sql.db.query(q2, [taskList[0].taskListID]);

    const results = {
      taskListID: taskList[0].taskListID,
      tasks: tasks,
    };

    sql.incrementEndpoint(74);
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

module.exports = {
  addTaskList,
  deleteTaskList,
  getTaskList,
};
