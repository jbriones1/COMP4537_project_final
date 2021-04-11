const sql = require('../db');
const { getUserFromToken } = require('../token');

/**
 * Gets the user from the database by userID.
 *
 * @param {Object} req request
 * @param {Object} res response
 */
const getUserByID = async (req, res) => {
  try {
    const { userID } = await getUserFromToken(req.token);

    console.log(typeof userID);
    if (userID == null) return res.sendStatus(400);

    const sql_statement = `SELECT username,name,isAdmin 
      FROM User 
      WHERE userID = ?`;

    const [result] = await sql.db.query(sql_statement, [userID]);

    sql.incrementEndpoint(54);
    res.status(200).json(result[0]);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

module.exports = {
  getUserByID,
};
