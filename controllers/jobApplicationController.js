const JobApplication = require(`../models/JobApplicationModel`);
const CustomError = require(`../errors`);
const { StatusCodes } = require(`http-status-codes`);
const checkPermissions = require(`../utils/checkPermissions`);

// CREATE JOB APPLICATION (USER)
const createJobApplication = async (req, res) => {
  const jobApplication = await JobApplication.create(req.body);
  res.status(StatusCodes.CREATED).json({ jobApplication });
};

// GET ALL JOB APPLICATIONS (USER)
const getAllJobApplications = async (req, res) => {
  const appliedJobs = await JobApplication.find({
    createdBy: req.user.userId,
  }).sort({ createdAt: -1 });

  res.status(StatusCodes.OK).json({ appliedJobs, count: appliedJobs.length });
};

// GET SINGLE JOB APPLICATION (USER)
const getSingleJobApplication = async (req, res) => {
  const { id } = req.params;
  const job = await JobApplication.findOne({ _id: id });
  if (!job) {
    throw new CustomError.NotFoundError(`Job with id:${id} not found`);
  }
  res.status(StatusCodes.OK).json({ job });
};

// UPDATE SINGLE JOB APPLICATION (USER)
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

// DELETE SINGLE JOB APPLICATION (USER)
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
  createJobApplication,
  getAllJobApplications,
  getSingleJobApplication,
  updateJobApplication,
  deleteJobApplication,
};
