const User = require(`../models/UserModel`);
const Employer = require(`../models/EmployerModel`);
const { StatusCodes } = require(`http-status-codes`);
const CustomError = require(`../errors/`);
const { createJWT } = require('../utils/jwt');

// REGISTER USER
const registerUser = async (req, res) => {
  const { email } = req.body;
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError(`Email already exists`);
  }

  const user = await User.create(req.body);
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

// REGISTER EMPLOYER
const registerEmployer = async (req, res) => {
  const { email } = req.body;
  const emailAlreadyExists = await Employer.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError(`Email already exists`);
  }

  const employer = await Employer.create(req.body);
  const tokenUser = {
    userId: employer._id,
    name: employer.name,
    email: employer.email,
    role: employer.role,
    vip: employer.vip,
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

// LOGIN EMPLOYER
const loginEmployer = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError(`Please provide email and password`);
  }

  const employer = await Employer.findOne({ email });
  if (!employer) {
    throw new CustomError.UnauthenticatedError(`Email not registered`);
  }

  const isPasswordCorrect = await employer.comparePassword(password);
  console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError(`Incorrect Password`);
  }
  const tokenUser = {
    userId: employer._id,
    name: employer.name,
    email: employer.email,
    role: employer.role,
    vip: employer.vip,
  };
  const token = createJWT(tokenUser);
  res.status(StatusCodes.OK).json({ ...tokenUser, token });
};

module.exports = { registerUser, loginUser, registerEmployer, loginEmployer };
