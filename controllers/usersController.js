const User = require(`../models/UserModel`);
const CustomError = require(`../errors/`);
const { StatusCodes } = require(`http-status-codes`);
const checkPermissions = require(`../utils/checkPermissions`);

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
    runValidators: true,
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

module.exports = { getAllUsers, getSingleUser, updateUser, deleteUser };
