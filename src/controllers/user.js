import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import userModel from "../models/user.js";

const SIGN_UP = async (req, res) => {
  try {
    const hasAtSymbol = /@/.test(req.body.email);

    if (!hasAtSymbol) {
      return res.status(400).json({
        message: "The email entered is in worng format",
      });
    }

    const password = req.body.password;

    if (password.length < 6) {
      return res.status(400).json({
        message: "The password must be at least 6 symbols long",
      });
    }

    const hasNumber = /\d/.test(password);

    if (!hasNumber) {
      return res.status(400).json({
        message: "The password must contain at least one number",
      });
    }

    const userName = req.body.name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    const salt = await bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const user = new userModel({
      id: uuidv4(),
      name: userName,
      email: req.body.email,
      password: passwordHash,
    });

    const response = await user.save();

    const jwtToken = jwt.sign(
      { email: user.email, userId: user.id },
      process.env.JWT_TOKEN,
      { expiresIn: "12h" }
    );

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
