const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../utils/Errors');

const { JWT_SECRET } = process.env;
console.log(JWT_SECRET);

// Запрос всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((Users) => res.status(200).send(Users))
    .catch(next);
};

// Запрос пользователя
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(404, 'Пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

// Запрос пользователя по ID
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new NotFoundError(404, 'Пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

// Создание пользователя (прикрутил по дефолту данные в схеме пользователя(аватарку, имя, о себе),
// т.к при регистрации эти данные не требуются.
module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10).then((hashPass) => {
    User.create({ password: hashPass, email })
      .then((user) => res.status(200).send({ _id: user._id }))
      .catch((error) => {
        if (error.code === 11000) {
          next(new NotFoundError(409, error.message));
        } else {
          next(new NotFoundError(400, error.message));
        }
      });
  });
};

// Обновление профиля
module.exports.changeUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(new NotFoundError(404, 'Пользователь не найден'))
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

// Обновление Аватара
module.exports.changeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(new NotFoundError(404, 'Пользователь не найден'))
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

// Логин

module.exports.login = (req, res, next) => {
  const { password, email } = req.body;
 console.log(User.findUserByCredentials(email, password))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
