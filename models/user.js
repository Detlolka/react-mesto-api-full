const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const NotFoundError = require('../utils/Errors');

const linkValidate = /^(https?:\/\/(www\.)?)[\w-]+\.[\w./():,-]+#?$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Имя',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'О себе',
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return linkValidate.test(v);
      },
      message: 'Введите корректный URL',
    },
    default: 'https://f2.mylove.ru/uHovon10A7.jpg',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(v) {
        return isEmail(v);
      },
      message: 'Указан неправильный email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError(401, 'Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new NotFoundError(401, 'Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
