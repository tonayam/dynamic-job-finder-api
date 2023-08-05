const SavedJob = require(`../models/SavedJobModel`);
const CustomError = require(`../errors`);
const { StatusCodes } = require(`http-status-codes`);
const checkPermissions = require(`../utils/checkPermissions`);

// CREATE SAVED JOB
const createSavedJob = async (req, res) => {
  const savedJob = await SavedJob.create({
    ...req.body,
    createdBy: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json({ savedJob });
};

// GET SAVED JOBS
const getAllSavedJobs = async (req, res) => {
  const savedJobs = await SavedJob.find({
    createdBy: req.user.userId,
  })
    .sort({ createdAt: -1 })
    .populate({
      path: `job`,
      select: `jobTitle location companyName createdAt`,
    });

  res.status(StatusCodes.OK).json({ savedJobs, count: savedJobs.length });
};

// GET SINGLE SAVED JOB
const getSingleJobApplication = async (req, res) => {
  const { id } = req.params;
  const job = await JobApplication.findOne({ _id: id });
  if (!job) {
    throw new CustomError.NotFoundError(`Job with id:${id} not found`);
  }
  res.status(StatusCodes.OK).json({ job });
};

// UPDATE SINGLE SAVED JOB
const updateJobApplication = async (req, res) => {
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

// DELETE SINGLE SAVED JOB
const deleteJobApplication = async (req, res) => {
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
  createSavedJob,
  getAllSavedJobs,
  getSingleJobApplication,
  updateJobApplication,
  deleteJobApplication,
};
