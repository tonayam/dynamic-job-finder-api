const User = require(`../models/UserModel`);
const { StatusCodes } = require(`http-status-codes`);
const CustomError = require(`../errors/`);
const { createJWT } = require('../utils/jwt');

// REGISTER USER
const registerUser = async (req, res) => {
  const { email, role: userRole } = req.body;
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError(`Email already exists`);
  }

  // FIRST REGISTERED USER IS ADMIN
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? `admin` : userRole;
  const vip = isFirstAccount ? true : false;

  const user = await User.create({ ...req.body, role, vip });
  const tokenUser = {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    vip: user.vip,
  };
  const token = createJWT(tokenUser);
  res.status(StatusCodes.CREATED).json({ ...tokenUser, token });
};

// LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError(`Please provide email and password`);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError(`Email not registered`);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError(`Incorrect Password`);
  }
  const tokenUser = {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    vip: user.vip,
  };
  const token = createJWT(tokenUser);
  res.status(StatusCodes.OK).json({ ...tokenUser, token });
};

module.exports = { registerUser, loginUser };
