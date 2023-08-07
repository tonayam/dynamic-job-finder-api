const {
  registerUser,
  loginUser,
  registerEmployer,
  loginEmployer,
} = require('../controllers/authController');

const router = require(`express`).Router();

router.post(`/register`, registerUser);
router.post(`/employer/register`, registerEmployer);
router.post(`/login`, loginUser);
router.post(`/employer/login`, loginEmployer);

module.exports = router;
