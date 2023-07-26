const router = require(`express`).Router();
const {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
} = require(`../controllers/usersController`);
const { authorizeRoles } = require('../middlewares/authentication');

router.get(`/`, authorizeRoles(`admin`), getAllUsers);
router
  .route(`/:id`)
  .get(authorizeRoles(`admin`, `user`), getSingleUser)
  .patch(authorizeRoles(`admin`, `user`, `employer`), updateUser)
  .delete(authorizeRoles(`admin`), deleteUser);

module.exports = router;
