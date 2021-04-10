const jwt = require('jsonwebtoken');

/**
 * Generates a JSON web token.
 * Access tokens expire in 30 minutes.
 *
 * @param {Object} user
 * @returns JSON Web Token
 */
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '30m' });
};

/**
 * Generates a JSON web token.
 * Refresh tokens are used to refresh expired access tokens.
 *
 * @param {Object} user
 * @returns JSON Web Token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_SECRET);
};

/**
 * Attempts to authenticate the JSON Web Token.
 * Authorization header must come in as "Bearer [token]"
 *
 * Returns 401 on no token
 * Returns 403 on invalid token
 *
 * @param {Object} req request
 * @param {Object} res response
 * @param {Function} next next
 * @returns status code
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    // Token is no longer valid
    if (err) return res.sendStatus(403);

    req.token = token;

    next();
  });
};

/**
 * Verifies a refresh token and creates a new access token if refresh token is valid.
 *
 * @param {String} refreshToken
 */
const verifyRefreshToken = async (refreshToken) => {
  const user = await jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  delete user.iat;
  return generateAccessToken(user);
};

const getUserFromToken = async (accessToken) => {
  return await jwt.verify(accessToken, process.env.TOKEN_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
  verifyRefreshToken,
  getUserFromToken,
};
