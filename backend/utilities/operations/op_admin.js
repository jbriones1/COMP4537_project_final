const sql = require('../db');
const jwt = require('jsonwebtoken');

/**
 * Gets the admin stats for API requests.
 * Verifies the user is an admin first.
 *
 * 200: success
 * 400: token missing
 * 403: not an admin
 * 500: database or verification error
 *
 * @param {Object} req request
 * @param {Object} res result
 * @returns status code
 */
exports.getAdminStats = async (req, res) => {
  const query = 'SELECT * FROM apicount';

  try {
    if (!req.token || typeof req.token !== 'string') return res.sendStatus(400);

    const token = await jwt.verify(req.token, process.env.TOKEN_SECRET);

    if (token.isAdmin !== 1) return res.sendStatus(403);

    sql.incrementEndpoint(94);
    sql.db
      .query(query)
      .then(([result]) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
