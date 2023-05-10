const { boolean } = require("joi");
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
      required: false,
    },
    isApproved: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
