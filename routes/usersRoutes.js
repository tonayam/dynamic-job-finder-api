const router = require(`express`).Router();
const {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  getUpdatedUserInfo,
  updateUserPassword,
} = require(`../controllers/usersController`);
const { authorizeRoles } = require('../middlewares/authentication');

router.get(`/`, authorizeRoles(`admin`), getAllUsers);
router.get(`/show-me`, getUpdatedUserInfo);
router.post(`/update-password`, updateUserPassword);

router
  .route(`/:id`)
  .get(authorizeRoles(`admin`, `user`), getSingleUser)
  .patch(authorizeRoles(`admin`, `user`), updateUser)
  .delete(authorizeRoles(`admin`), deleteUser);

module.exports = router;
