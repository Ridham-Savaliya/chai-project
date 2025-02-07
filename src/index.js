import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import mongoose from "mongoose";
import { DB_NAME } from "../../chaicode-project/src/constants.js";
import connectToDatabase from "./db/index.js";
import { app } from "../src/app.js";

const primaryPort = parseInt(process.env.PORT) || 3000;
const fallbackPort = 3002;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.warn(`⚠️ Port ${port} is already in use.`);
      if (port === primaryPort) {
        console.log(`🔄 Trying fallback port: ${fallbackPort}`);
        startServer(fallbackPort);
      } else {
        console.error(`❌ Ports ${primaryPort} and ${fallbackPort} are both in use. Exiting.`);
        process.exit(1);
      }
    } else {
      throw error;
    }
  });
}

connectToDatabase()
  .then(() => {
    startServer(primaryPort);
  })
  .catch((error) => {
    console.error("ERROR: ", error);
    throw error;
  });
