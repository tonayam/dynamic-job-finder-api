const Employer = require(`../models/EmployerModel`);
const CustomError = require(`../errors`);
const { StatusCodes } = require(`http-status-codes`);
const checkPermissions = require(`../utils/checkPermissions`);

// GET ALL EMPLOYERS
const getAllEmployers = async (req, res) => {
  const employers = await Employer.find().select(`-password`);
  res.status(StatusCodes.OK).json({ employers, count: employers.length });
};

// GET SINGLE EMPLOYER
const getSingleEmployer = async (req, res) => {
  const { id } = req.params;
  const employer = await Employer.findOne({ _id: id }).select(`-password`);
  if (!employer) {
    throw new CustomError.NotFoundError(`Employer with id:${id} not found`);
  }
  checkPermissions(req.user, employer._id);
  res.status(StatusCodes.OK).json(employer);
};

// uPDATE SINGLE EMPLOYER
const updateEmployer = async (req, res) => {
  const { id } = req.params;
  const employer = await Employer.findOne({ _id: id });
  if (!employer) {
    throw new CustomError.NotFoundError(`Employer with id:${id} not found`);
  }
  checkPermissions(req.user, employer._id);
  const updatedEmployer = await Employer.findOneAndUpdate(
    { _id: id },
    req.body,
    {
      new: true,
    }
  ).select(`-password`);
  res
    .status(StatusCodes.OK)
    .json({ updatedEmployer, msg: `Employer successfully updated` });
};

// DELETE SINGLE EMPLOYER
const deleteEmployer = async (req, res) => {
  const { id } = req.params;
  const employer = await Employer.findOne({ _id: id });
  if (!employer) {
    throw new CustomError.NotFoundError(`Employer with id:${id} not found`);
  }
  await Employer.findOneAndDelete({ _id: id });
  res.status(StatusCodes.OK).json({ msg: `Employer successfully deleted` });
};

// GET UPDATED EMPLOYER DETAILS
const getUpdatedEmployerInfo = async (req, res) => {
  const employer = await Employer.findOne({ _id: req.user.userId }).select(
    `-password`
  );
  res.status(StatusCodes.OK).json(employer);
};

module.exports = {
  getAllEmployers,
  getSingleEmployer,
  deleteEmployer,
  updateEmployer,
  getUpdatedEmployerInfo,
};
