const router = require(`express`).Router();
const {
  createSavedJob,
  deleteSavedJob,
  getAllSavedJobs,
  getSingleJobApplication,
  updateJobApplication,
} = require(`../controllers/savedJobsController`);
const {
  authorizeRoles,
  authenticateUser,
} = require('../middlewares/authentication');

router.post(`/`, authorizeRoles(`user`), createSavedJob);
router.get(`/`, authorizeRoles(`user`), getAllSavedJobs);

router
  .route(`/:id`)
  .get(
    authenticateUser,
    authorizeRoles(`user`, `admin`, `employer`),
    getSingleJobApplication
  )
  .patch(
    authenticateUser,
    authorizeRoles(`admin`, `employer`, `user`),
    updateJobApplication
  )
  .delete(
    authenticateUser,
    authorizeRoles(`admin`, `employer`, `user`),
    deleteSavedJob
  );

module.exports = router;
