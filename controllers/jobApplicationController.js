const JobApplication = require(`../models/JobApplicationModel`);
const CustomError = require(`../errors`);
const { StatusCodes } = require(`http-status-codes`);
const checkPermissions = require(`../utils/checkPermissions`);
const cloudinary = require(`cloudinary`).v2;
const fs = require(`fs`);
const path = require('path');

// CREATE JOB APPLICATION (USER)
const createJobApplication = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.resume.tempFilePath,
    {
      use_filename: true,
      folder: `Dynamic-job-finder-resumes`,
    }
  );
  fs.unlinkSync(req.files.resume.tempFilePath);
  const jobApplication = await JobApplication.create({
    ...req.body,
    createdBy: req.user.userId,
    resume: result.secure_url,
  });
  res.status(StatusCodes.CREATED).json({ jobApplication });
};

// GET ALL JOB APPLICATIONS (USER)
const getAllJobApplications = async (req, res) => {
  const appliedJobs = await JobApplication.find({
    createdBy: req.user.userId,
  })
    .sort({ createdAt: -1 })
    .populate({
      path: `job`,
      select: `jobTitle location companyName createdAt`,
    });

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

// GET ALL JOB APPLICATIONS (EMPLOYER)
const getAllJobApplicationsEmployer = async (req, res) => {
  const totalApplications = await JobApplication.find({
    employer: req.user.userId,
  })
    .sort({ createdAt: -1 })
    .select(`-employer`)
    .populate({
      path: `job`,
      select: `jobTitle`,
    });

  res
    .status(StatusCodes.OK)
    .json({ totalApplications, count: totalApplications.length });
};

module.exports = {
  createJobApplication,
  getAllJobApplications,
  getSingleJobApplication,
  updateJobApplication,
  deleteJobApplication,
  getAllJobApplicationsEmployer,
};
