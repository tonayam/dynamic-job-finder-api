const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    desc: { type: String, required: true },
    offeredSalary: { type: Number, required: true },
    gender: { type: String, required: true },
    experience: { type: String, required: true },
    qualification: { type: String, required: true },
    jobExpiration: { type: String, required: true },
    location: { type: String, required: true },
    keywords: { type: Array, required: true },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: `User`,
      required: [true, 'Please provide user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

JobSchema.virtual(`job application`, {
  ref: `Job Application`,
  localField: `_id`,
  foreignField: `job`,
  justOne: false,
});

module.exports = mongoose.model('Job', JobSchema);
