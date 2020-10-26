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
    .then((card) => {
      Card.findById(card._id).populate(['owner'])
        .orFail(new NotFoundError(404, 'Данный id отсутствует в базе данных'))
        .then((cardAdd) => {
          res.status(200).send(cardAdd);
        });
    }).catch(() => next(new NotFoundError(400, 'Невалидный Id')));
};

// Удаление карточки
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(new NotFoundError(404, 'Карточка отсутствует в базе данных'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        throw new NotFoundError(403, 'Вы пытаетесь удалить чужую карточку');
      }
      card.remove()
        .then((deleteCard) => res.send({ data: deleteCard }));
    })
    .catch(next);
};

// Постановка лайка карточке
module.exports.likeCard = (req, res, next) => {
  Card.findOneAndUpdate({ _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true }).populate(['owner', 'likes'])
    .orFail(new NotFoundError(404, 'Данный id отсутствует в базе данных'))
    .then((card) => res.status(200).send(card))
    .catch(() => next(new NotFoundError(400, 'Невалидный Id')));
};

// Удаление лайка с карточки

module.exports.dislikeCard = (req, res, next) => {
  Card.findOneAndUpdate({ _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true }).populate(['owner', 'likes'])
    .orFail(new NotFoundError(404, 'Данный id отсутствует в базе данных'))
    .then((card) => res.status(200).send(card))
    .catch(() => next(new NotFoundError(400, 'Невалидный Id')));
};
