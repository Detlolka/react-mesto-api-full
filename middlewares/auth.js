const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
const NotFoundError = require('../utils/Errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization && !authorization.startsWith('Bearer ')) {
    throw new NotFoundError(401, 'Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new NotFoundError(401, 'Необходима авторизация');
  }

  req.user = payload;
  next();
};
