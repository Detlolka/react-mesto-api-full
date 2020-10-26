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
  Card.findById(req.params.id)
    .orFail(new NotFoundError(404, 'Данный id отсутствует в базе данных'))
    .then((card) => {
      if (card.owner.toString() === req.user._id.toString()) {
        Card.findOneAndDelete({ _id: card._id })
          .populate(['owner', 'likes'])
          .orFail(new NotFoundError(404, 'Данный id отсутствует в базе данных'))
          .then((deletedCard) => {
            res.status(200).send(deletedCard);
          });
      } else {
        throw new NotFoundError(403, 'Вы пытаетесь удалить чужую карточку');
      }
    }).catch(next);
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
