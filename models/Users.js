const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const TestSchema = mongoose.Schema(
  {
    currentTopicId : {type : String},
    topic : {type : String}
  }
)

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    designation : {type : String, required : true},
    image : {type : String},
    Tests : [TestSchema],
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);
