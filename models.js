const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: String,
  commentcount: { type: Number, default: 0 },
  comments: [String]
});

module.exports = mongoose.model("Books", bookSchema);
