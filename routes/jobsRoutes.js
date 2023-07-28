const router = require(`express`).Router();
const {
  deleteJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  createJob,
  getAllEmployerJobs,
  getAllEmployerJobsAdmin,
} = require(`../controllers/jobController`);
const {
  authorizeRoles,
  authenticateUser,
} = require('../middlewares/authentication');

router.get(`/`, getAllJobs);
router.get(`/my-jobs`, authorizeRoles(`admin`, `employer`), getAllEmployerJobs);
router.get(
  `/employer-jobs/:id`,
  authenticateUser,
  authorizeRoles(`admin`),
  getAllEmployerJobsAdmin
);
router.post(
  `/`,
  authenticateUser,
  authorizeRoles(`admin`, `employer`),
  createJob
);
router
  .route(`/:id`)
  .get(getSingleJob)
  .patch(authenticateUser, authorizeRoles(`admin`, `employer`), updateJob)
  .delete(authenticateUser, authorizeRoles(`admin`, `employer`), deleteJob);

module.exports = router;
