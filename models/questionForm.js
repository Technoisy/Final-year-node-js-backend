const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
  imagePath: { type: String },
});

const topicSchema = mongoose.Schema({
  topicName: { type: String, required: true },
  questions: { type: [questionSchema], required: true },
});

module.exports = mongoose.model("Topic", topicSchema);