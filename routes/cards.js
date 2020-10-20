const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

// Запрос всех карт
router.get('/', getCards);

// Создание карточки
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^(http|https):\/\/[^ "]+$/),
  }),
}), createCard);

// Удаление карточки
router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required().length(24),
  }),
}), deleteCard);

router.put('/likes/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
}), likeCard);

router.delete('/likes/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
}), dislikeCard);

module.exports = router;
