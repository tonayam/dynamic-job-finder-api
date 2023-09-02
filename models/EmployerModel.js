const mongoose = require(`mongoose`);
const bcrypt = require(`bcryptjs`);
const validator = require(`validator`);

const EmployerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, `Please provide company name`],
  },
  password: {
    type: String,
    required: [true, `Please provide password`],
    minlength: [8, `Minimum of 8 characters`],
  },
  email: {
    type: String,
    required: [true, `Please provide email`],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: `Please provide valid email`,
    },
  },
  role: {
    type: String,
    default: `employer`,
  },
  companyDesc: {
    type: String,
    required: [true, `Please provide company brief`],
  },
  isSubscribed: { type: Boolean, default: false },
  primaryIndustry: { type: String },
  industryCategory: { type: String },
  location: { type: String },
  noOfEmployees: { type: String },
});

EmployerSchema.pre(`save`, async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

EmployerSchema.methods.comparePassword = async function (incomingPassword) {
  const isMatch = await bcrypt.compare(incomingPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model(`Employer`, EmployerSchema);
