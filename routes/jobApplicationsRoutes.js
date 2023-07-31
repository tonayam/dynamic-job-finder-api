const router = require(`express`).Router();
const {
  createJobApplication,
  deleteJobApplication,
  getAllJobApplications,
  getSingleJobApplication,
  updateJobApplication,
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
    deleteJobApplication
  );

module.exports = router;
