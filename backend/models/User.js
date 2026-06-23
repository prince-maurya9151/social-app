const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be atleast 3 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'password required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
     },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('User', UserSchema);