const Card = require('../models/сard');
const NotFoundError = require('../utils/Errors');

// Запрос всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

// Создание карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .orFail(new NotFoundError(404, 'Данный id отсутсвует в базе данных'))
    .populate(['owner'])
    .then((card) => res.status(200).send(card))
    .catch((error) => next(new NotFoundError(400, error.message)));
};

// Удаление карточки
module.exports.deleteCard = (req, res, next) => {
  Card.findOneAndDelete({ _id: req.params.id })
    .orFail(new NotFoundError(404, 'Данный id отсутствует в базе данных'))
    .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch(next);
};

// Постановка лайка карточке
module.exports.likeCard = (req, res, next) => {
  Card.findOneAndUpdate({ _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true }).populate(['owner', 'likes'])
    .orFail(new NotFoundError(404, 'Данный id отсутствует в базе данных'))
    .then((card) => res.status(200).send(card))
    .catch(next);
};

// Удаление лайка с карточки

module.exports.dislikeCard = (req, res, next) => {
  Card.findOneAndUpdate({ _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true }).populate(['owner', 'likes'])
    .orFail(new NotFoundError(404, 'Данный id отсутствует в базе данных'))
    .then((card) => res.status(200).send(card))
    .catch(next);
};
