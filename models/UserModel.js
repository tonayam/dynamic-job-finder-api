const mongoose = require(`mongoose`);
const bcrypt = require(`bcryptjs`);
const jwt = require(`jsonwebtoken`);
const validator = require(`validator`);

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Please provide name`],
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
    default: `user`,
  },
  employmentStatus: { type: String, enum: [`employed`, `unemployed`] },
  preferredJobTitle: { type: String },
  desiredJobLocation: { type: String },
  openToRemoteWork: { type: Boolean, default: false },
  currentLocation: { type: String },
  currentCompany: { type: String },
  currentJobTitle: { type: String },
  githubLink: { type: String },
  portfolioLink: { type: String },
  linkendinLink: { type: String },
});

UserSchema.pre(`save`, async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (incomingPassword) {
  const isMatch = await bcrypt.compare(incomingPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model(`User`, UserSchema);
