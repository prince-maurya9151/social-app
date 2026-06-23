const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
     likes: [
      {
        username: { type: String, required: true },
        likedAt:  { type: Date, default: Date.now },
      },
    ],
    comments: [
      {
        username:  { type: String, required: true },
        text:      { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', PostSchema);