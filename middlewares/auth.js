const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;
const NotFoundError = require('../utils/Errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization && !authorization.startsWith('Bearer ')) {
    throw new NotFoundError(401, 'Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`,
    );
  } catch (err) {
    throw new NotFoundError(401, 'Необходима авторизация');
  }

  req.user = payload;
  next();
};
