const mongoose = require("mongoose");

const mediaSchema = mongoose.Schema({
  totalMedia: {
    type: Array,
    required: true,
    default: [],
  },
  movies: {
    type: Array,
    required: true,
    default: [],
  },
  similarMedia: {
    type: Array,
    required: true,
    default: [],
  },
  query: {
    type: Array,
    required: true,
    default: "",
  },
});

const Media = mongoose.model("Media", mediaSchema);
module.exports = Media;