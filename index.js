import express from "express";
import "dotenv/config";
import mongoose from "mongoose";

const app = express();

const router = express.router();

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Connected!"));

// app.use("/calendar", router);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT);
