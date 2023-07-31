const mongoose = require(`mongoose`);

const JobApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.ObjectId,
      ref: `Job`,
      required: [true, `Please provide job`],
    },
    employer: {
      type: mongoose.Schema.ObjectId,
      ref: `Employer`,
      required: [true, `Please provide employer`],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: `User`,
      required: [true, `Please provide applicant`],
    },
    firstName: { type: String, required: [true, `Please provide first name`] },
    lastName: { type: String, required: [true, `Please provide last name`] },
    email: { type: String, required: [true, `Please provide email`] },
    resume: { type: String, required: [true, `Please provide resume`] },
    city: { type: String },
    phone: { type: String },
    coverLetter: { type: String },
    noticePeriod: { type: String },
    expectedSalary: { type: String },
    applicationReason: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(`Job Application`, JobApplicationSchema);
