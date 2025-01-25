import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: `${process.env.CORS_ORIGIN}`,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// routes imports
import userRouter from "../src/routes/user.routes.js";

// routes delcarations
app.use("/api/v1/users", userRouter);



app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export { app };
