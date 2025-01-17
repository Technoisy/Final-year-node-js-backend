const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGO_URI = "mongodb+srv://faisal:doraemon%402502@cluster0.zyunp.mongodb.net/main";

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
