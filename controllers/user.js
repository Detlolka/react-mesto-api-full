const User = require('../models/user');

// Запрос всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((Users) => res.status(200).send(Users))
    .catch((error) => res.status(500).send({ message: error.message }));
};

// Запрос пользователя по ID
module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.message === 'NotValidId') {
        res.status(404).send({ message: 'Id отсутсвует в базе данных' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(404).send({ message: 'Получен невалидный Id' });
      }
      res.status(500).send({ message: error.message });
    });
};

// Создание пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Данные не валидны' });
      }
      res.status(500).send({ message: error.message });
    });
};

// Обновление профиля
module.exports.changeUser = (req, res) => {
  const { name, about } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Данные не валидны' });
        return;
      }
      if (error.message === 'NotValidId') {
        res.status(404).send({ message: 'Id отсутсвует в базе данных' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(404).send({ message: 'Получен невалидный Id' });
      }
      res.status(500).res.send({ message: error.message });
    });
};

// Обновление Аватара
module.exports.changeAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Данные не валидны' });
        return;
      }
      if (error.message === 'NotValidId') {
        res.status(404).send({ message: 'Id отсутсвует в базе данных' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(404).send({ message: 'Получен невалидный Id' });
      }
      res.status(500).send({ message: error.message });
    });
};
