const router = require('express').Router();
const {
  getUsers, getUserById, changeUser, changeAvatar,
} = require('../controllers/user');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/me', changeUser);
router.patch('/me/avatar', changeAvatar);

module.exports = router;
