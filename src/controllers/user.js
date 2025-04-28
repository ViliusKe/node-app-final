import { v4 as uuidv4 } from "uuid";
import userModel from "../models/user.js";

const SIGN_UP = async (req, res) => {
  try {
    const user = new userModel({
      id: uuidv4(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const response = await user.save();

    return res.status(200).json({
      message: "Signed up successfully",
      response: response,
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      message: "Problems occured",
    });
  }
};

export { SIGN_UP };
