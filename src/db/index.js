import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();


// first approach

const connectToDatabase = async () => {
  try {
    const connectionString = await mongoose.connect(`${process.env.MONGODB_URI}
        /${DB_NAME}`);

    console.log(`\n Connected to database on host-port: ${connectionString.connection.host}`);
  } catch (error) {
    console.log("ERROR: ", error);
    process
  }
};

export default connectToDatabase;

