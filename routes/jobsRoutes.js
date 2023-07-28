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
const { authorizeRoles } = require('../middlewares/authentication');

router.get(`/`, getAllJobs);
router.get(`/my-jobs`, authorizeRoles(`admin`, `employer`), getAllEmployerJobs);
router.get(
  `/employer-jobs/:id`,
  authorizeRoles(`admin`),
  getAllEmployerJobsAdmin
);
router.post(`/`, authorizeRoles(`admin`, `employer`), createJob);
router
  .route(`/:id`)
  .get(authorizeRoles(`admin`, `user`, `employer`), getSingleJob)
  .patch(authorizeRoles(`admin`, `employer`), updateJob)
  .delete(authorizeRoles(`admin`, `employer`), deleteJob);

module.exports = router;
