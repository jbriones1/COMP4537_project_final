'use strict';
const sql = require('./db');
const token = require('./token');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

/**
 * Creates a new user and stores it in the database.
 * Hashes the password.
 *
 * 200: Success
 * 400: Missing information
 * 500: Error storing in the database
 *
 * @param {Object} req request
 * @param {Object} res result
 * @returns status code
 */
const register = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const isAdmin = req.body.isAdmin;

  // Validate all user info is correct
  if (
    !req.body.username ||
    !req.body.password ||
    !req.body.name ||
    req.body.isAdmin == undefined
  ) {
    return res.sendStatus(400);
  }

  // Find out if the user is unique or not
  getUserByUsername(username).then((result) => {
    // If the username exists already, stop registration
    if (result.length > 0) return res.sendStatus(409);

    // Hash the password
    bcrypt.hash(password, SALT_ROUNDS).then((hash) => {
      const sql_statement = `INSERT INTO User (username,
                          user_password,
                          name,
                          isAdmin) 
        VALUES (?, ?, ?, ?)`;

      sql.db
        .query(sql_statement, [username, hash, name, isAdmin])
        .then((result) => {
          res.sendStatus(200);
        })
        .catch((err) => {
          res.sendStatus(500);
        });
    });
  });
};

/**
 * Finds the user using the username and password and returns the user object.
 *
 * @param {String} username
 * @returns user object
 */
const getUserByUsername = async (username) => {
  const query = `SELECT * 
     FROM User
     WHERE username = ?`;

  const result = await sql.db.query(query, [username]);

  return result[0];
};

/**
 * Inserts a refresh token into the database.
 *
 * @param {String} refreshToken
 * @returns JSON Web Token
 */
const insertToken = async (refreshToken) => {
  const query = `INSERT INTO token (token)
     VALUES (?)`;

  sql.db
    .query(query, [refreshToken])
    .then((result) => {
      return refreshToken;
    })
    .catch((err) => {
      console.log(err);
      return;
    });
};

/**
 * Refreshes an access token by using the refresh token.
 *
 * 200: Success
 * 500: Database or JSON Web Token error
 *
 * @param {Object} req request
 * @param {Object} res response
 * @returns status code
 */
const refresh = (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken == null) return res.sendStatus(401);

  const query = `SELECT * 
      FROM Token
      WHERE token = ?`;

  sql.db.query(query, [refreshToken]).then((result) => {
    // If no tokens are found
    if (result[0].length < 1) return res.sendStatus(403);

    token
      .verifyRefreshToken(refreshToken)
      .then((result) => {
        if (!result) return res.sendStatus(500);

        return res.status(200).json({
          accessToken: result,
        });
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  });
};

/**
 * Logs the user into the application
 *
 * 200: with the JSON WebToken if the user is authenticated
 * 400: on incorrect credentials
 *
 * @param {Object} req request
 * @param {Object} res response
 * @returns status code
 */
const login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) return res.sendStatus(400);

  // Make sure username and password match
  getUserByUsername(username)
    .then((result) => {
      // There should only be one entry returned
      if (result.length !== 1) return res.sendStatus(400);

      // Turn it into a plain JSON object
      const user = JSON.parse(JSON.stringify(result[0]));

      // Check the username and password
      bcrypt.compare(password, user.user_password).then((match) => {
        // Return an error if passwords don't match
        if (!match) return res.sendStatus(400);
        // Generate an access token (expires after 30 minutes) and a refresh token (expires on logout)
        delete user.user_password; // delete the password before creating a token
        const accessToken = token.generateAccessToken(user);
        const refreshToken = token.generateRefreshToken(user);

        // Insert the refresh token into the database
        insertToken(refreshToken)
          .then((result) => {
            return res.status(200).json({
              user,
              accessToken,
              refreshToken,
            });
          })
          .catch((err) => {
            console.log(err);
            return res.sendStatus(500);
          });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
};

/**
 * Logs the user out by deleting their refresh token.
 *
 * @param {Object} req request
 * @param {Object} res response
 */
const logout = (req, res) => {
  const query = `DELETE FROM token
     WHERE token = ?`;

  sql.db
    .query(query, [req.body.token])
    .then((result) => res.sendStatus(200))
    .catch((err) => res.sendStatus(500));
};

module.exports = {
  login,
  logout,
  refresh,
  register: register,
};
