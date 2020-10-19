const router = require('express').Router();
const {
  getUsers, getUserById, createUser, changeUser, changeAvatar, login,
} = require('../controllers/user');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/singup', createUser);
router.post('/singin', login);
router.patch('/me', changeUser);
router.patch('/me/avatar', changeAvatar);

module.exports = router;
