import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import userRouter from "./src/routes/user.js";

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Connected!"))
  .catch((error) => {
    console.log(error);
  });

app.use(userRouter);

app.use((req, res) => {
  return res.status(404).json({
    message: "Endpoint does not exist",
  });
});

app.listen(process.env.PORT);
