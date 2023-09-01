const router = require(`express`).Router();
const {
  createJobApplication,
  deleteJobApplication,
  getAllJobApplications,
  getSingleJobApplication,
  updateJobApplication,
  getAllJobApplicationsEmployer,
} = require(`../controllers/jobApplicationController`);
const {
  authorizeRoles,
  authenticateUser,
} = require('../middlewares/authentication');

router.post(
  `/`,
  authenticateUser,
  authorizeRoles(`user`),
  createJobApplication
);

router.get(
  `/`,
  authenticateUser,
  authorizeRoles(`user`),
  getAllJobApplications
);

router.get(`/my-jobs`, authenticateUser, getAllJobApplicationsEmployer);

router
  .route(`/:id`)
  .get(
    authenticateUser,
    authorizeRoles(`admin`, `employer`, `user`),
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
    deleteJobApplication
  );

module.exports = router;
