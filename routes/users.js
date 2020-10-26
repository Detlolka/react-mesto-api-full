const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUser, getUserById, changeUser, changeAvatar,
} = require('../controllers/user');

router.get('/me', getUser);
router.get('/', getUsers);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), changeUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(https?:\/\/(www\.)?)[\w-]+\.[\w./():,-]+#?$/),
  }),
}), changeAvatar);

module.exports = router;
