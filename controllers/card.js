const Card = require('../models/сard');

// Запрос всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send(cards))
    .catch((error) => res.status(500).send({ message: error.message }));
};

// Создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .orFail(new Error('ValidationError'))
    .populate(['owner'])
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Данные не валидны' });
        return;
      }
      res.status(500).send({ message: error.message });
    });
};

// Удаление карточки
module.exports.deleteCard = (req, res) => {
  Card.findOneAndDelete({ _id: req.params.id })
    .orFail(new Error('NotValidId'))
    .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.message === 'NotValidId') {
        res.status(404).send({ message: 'Id отсутсвует в базе данных' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(404).send({ message: 'Получен невалидный Id' });
        return;
      }
      res.status(500).send({ messsage: error.message });
    });
};

// Постановка лайка карточке
module.exports.likeCard = (req, res) => {
  Card.findOneAndUpdate({ _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true }).populate(['owner', 'likes'])
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.message === 'NotValidId') {
        res.status(404).send({ message: 'Id отсутсвует в базе данных' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(404).send({ message: 'Получен невалидный Id' });
        return;
      }
      res.status(500).send({ message: error.message });
    });
};

// Удаление лайка с карточки

module.exports.dislikeCard = (req, res) => {
  Card.findOneAndUpdate({ _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true }).populate(['owner', 'likes'])
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.message === 'NotValidId') {
        res.status(404).send({ message: 'Id отсутсвует в базе данных' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(404).send({ message: 'Получен невалидный Id' });
        return;
      }
      res.status(500).send({ message: error.message });
    });
};
