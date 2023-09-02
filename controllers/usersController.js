const User = require(`../models/UserModel`);
const CustomError = require(`../errors/`);
const { StatusCodes } = require(`http-status-codes`);
const checkPermissions = require(`../utils/checkPermissions`);
const bcrypt = require(`bcryptjs`);

// GET ALL USERS
const getAllUsers = async (req, res) => {
  const users = await User.find().select(`-password`);
  res.status(StatusCodes.OK).json({ users, count: users.length });
};

// GET SINGLE USER
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select(`-password`);
  if (!user) {
    throw new CustomError.NotFoundError(`User with id:${id} not found`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

// uPDATE SINGLE USER
const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new CustomError.NotFoundError(`User with id:${id} not found`);
  }
  checkPermissions(req.user, user._id);
  const updatedUser = await User.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  }).select(`-password`);
  res
    .status(StatusCodes.OK)
    .json({ updatedUser, msg: `User successfully updated` });
};

// DELETE SINGLE USER
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new CustomError.NotFoundError(`User with id:${id} not found`);
  }
  const updatedUser = await User.findOneAndDelete({ _id: id });
  res.status(StatusCodes.OK).json({ msg: `User successfully deleted` });
};

// GET UPDATED USER DETAILS
const getUpdatedUserInfo = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select(`-password`);
  res.status(StatusCodes.OK).json(user);
};

// UPDATE USER PASSWORD
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.NotFoundError(`Please provide old and new password`);
  }
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new CustomError.NotFoundError(`User with id:${id} not found`);
  }
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError(`Incorrect Password`);
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: `Password Updated` });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getUpdatedUserInfo,
  updateUserPassword,
};
