const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // connect to the MongoDB cluster
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If connection is successful, log a confirmation message
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If there's an error, log it and exit the application
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process with a failure code
  }
};

module.exports = connectDB;
