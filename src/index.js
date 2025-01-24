import dotenv from "dotenv";
dotenv.config({path: "./.env"});
import mongoose from "mongoose";
import express from "express";
const app = express();
import { DB_NAME } from "../../chaicode-project/src/constants.js";
import connectToDatabase from "./db/index.js";

connectToDatabase();




// second approach
// import express from "express";
// const app = express();
// import dotenv from "dotenv";
// dotenv.config();
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

//     console.log("Connected to database");

//     app.get("/", (req, res) => {
//         res.send("Hello World!");
//     })
//     app.on("error", (error) => {
//       console.error("ERROR: ", error);
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`Server is running on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.error("ERROR: ", error);
//     throw error;
//   }
// })();
