const mongoose = require(`mongoose`);

const SavedJobSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(`Saved Job`, SavedJobSchema);
