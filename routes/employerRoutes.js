const router = require(`express`).Router();
const {
  deleteEmployer,
  getAllEmployers,
  getSingleEmployer,
  getUpdatedEmployerInfo,
  updateEmployer,
} = require(`../controllers/employersController`);
const { authorizeRoles } = require('../middlewares/authentication');

router.get(`/`, authorizeRoles(`admin`), getAllEmployers);
router.get(`/show-me`, getUpdatedEmployerInfo);

router
  .route(`/:id`)
  .get(authorizeRoles(`admin`, `employer`), getSingleEmployer)
  .patch(authorizeRoles(`admin`, `employer`), updateEmployer)
  .delete(authorizeRoles(`admin`), deleteEmployer);

module.exports = router;
