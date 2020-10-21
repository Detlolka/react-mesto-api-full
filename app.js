const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { celebrate, Joi, errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundError = require('./utils/Errors');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors({
  origin: 'https://api.detlolka-m.students.nomoreparties.space',
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Адрес сервера mongo по умолчанию и mydb - имя базы данных
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(3),
    email: Joi.string().required().min(3),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(3),
    password: Joi.string().required().min(3),
  }),
}), createUser);

app.use(auth);

app.use('/cards', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), auth, cards);

app.use('/users', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), auth, users);

app.all('*', () => {
  throw NotFoundError(404, 'Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка' : message,
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(PORT);
});
