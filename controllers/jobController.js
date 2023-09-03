const Job = require(`../models/JobModel`);
const CustomError = require(`../errors`);
const { StatusCodes } = require(`http-status-codes`);
const checkPermissions = require(`../utils/checkPermissions`);

// CREATE JOB
const createJob = async (req, res) => {
  const { userId } = req.user;
  const job = await Job.create({ ...req.body, createdBy: userId });
  res.status(StatusCodes.OK).json({ job });
};

// GET ALL JOBS
const getAllJobs = async (req, res) => {
  const { jobTitle } = req.query;
  const queryObject = {};
  if (jobTitle) {
    queryObject.jobTitle = { $regex: jobTitle, $options: `i` };
  }
  const jobs = await Job.find(queryObject).sort({ createdAt: -1 });
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

// GET ALL JOBS CREATED BY EMPLOYER (ADMIN)
const getAllEmployerJobsAdmin = async (req, res) => {
  const { id: employerId } = req.params;
  const jobs = await Job.find({ createdBy: employerId });
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

// GET ALL JOBS CREATED BY EMPLOYER
const getAllEmployerJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

// GET SINGLE JOB
const getSingleJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findOne({ _id: id });
  if (!job) {
    throw new CustomError.NotFoundError(`Job with id:${id} not found`);
  }
  res.status(StatusCodes.OK).json({ job });
};

// UPDATE SINGLE JOB
const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    throw new CustomError.NotFoundError(`Job with id:${jobId} not found`);
  }
  checkPermissions(req.user, job.createdBy);
  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    runValidators: true,
    new: true,
  });
  res
    .status(StatusCodes.OK)
    .json({ updatedJob, msg: `Job successfully updated` });
};

// DELETE SINGLE JOB
const deleteJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findOne({ _id: id });
  if (!job) {
    throw new CustomError.NotFoundError(`Job with id:${id} not found`);
  }
  checkPermissions(req.user, job.createdBy);
  const deletedJob = await Job.findOneAndDelete({ _id: id });
  res.status(StatusCodes.OK).json({ msg: `Job successfully deleted` });
};

module.exports = {
  createJob,
  getAllJobs,
  getAllEmployerJobs,
  getAllEmployerJobsAdmin,
  getSingleJob,
  updateJob,
  deleteJob,
};
