const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://aryan_hotel:NcXtKYNoH95fYBPg@cluster0.p1qkbkr.mongodb.net/Zomato?appName=Cluster0");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
