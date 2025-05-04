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
      money_balance: req.body.money_balance,
    });

    const response = await user.save();

    const jwtToken = jwt.sign(
      { email: user.email, userId: user.id },
      process.env.JWT_TOKEN,
      { expiresIn: "2h" }
    );

    const jwtTokenRefresh = jwt.sign(
      { email: user.email, userId: user.id },
      process.env.JWT_TOKEN,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Signed up successfully",
      response: response,
      jwt_token: jwtToken,
      jwt_refresh_token: jwtTokenRefresh,
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      message: "Problems occured",
    });
  }
};

const LOGIN = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: "Bad email or password" });
    }

    const comparePassword = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!comparePassword) {
      return res.status(401).json({ message: "Bad email or password" });
    }

    const jwtToken = jwt.sign(
      { email: user.email, userId: user.id },
      process.env.JWT_TOKEN,
      { expiresIn: "2h" }
    );

    const jwtTokenRefresh = jwt.sign(
      { email: user.email, userId: user.id },
      process.env.JWT_TOKEN,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Loged in successfully",
      jwt_token: jwtToken,
      jwt_refresh_token: jwtTokenRefresh,
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      message: "Problems occured",
    });
  }
};

const GET_NEW_TOKEN = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Bad token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    const jwtToken = jwt.sign(
      { email: decoded.email, userId: decoded.userId },
      process.env.JWT_TOKEN,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "New token",
      jwt_token: jwtToken,
      current_jwt_refresh_token: req.headers.authorization,
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      message: "Problems occured",
    });
  }
};

const ALL_USERS = async (req, res) => {
  try {
    const data = await userModel.find().select("name id").sort({ name: 1 });

    return res.status(200).json({
      users: data,
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      message: "Problems occured",
    });
  }
};

const USER_BY_ID = async (req, res) => {
  try {
    const data = await userModel.findOne({ id: req.params.id }).select("name");

    if (!data) {
      return res.status(404).json({
        message: `User with id ${req.params.id} not found`,
      });
    }

    return res.status(200).json({
      user: data,
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      message: "Problems occured",
    });
  }
};

const ALL_USERS_WITH_TICKETS = async (req, res) => {
  try {
    const data = await userModel
      .find({ bought_tickets: { $ne: [] } })
      .select("name id bought_tickets")
      .sort({ name: 1 });

    return res.status(200).json({
      users: data,
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      message: "Problems occured",
    });
  }
};

const USER_WITH_TICKETS_BY_ID = async (req, res) => {
  try {
    const data = await userModel
      .find({ id: req.params.id, bought_tickets: { $ne: [] } })
      .select("name id bought_tickets");

    if (!data || data.length === 0) {
      return res.status(400).json({
        message: "user does not exist or does not have tickets",
      });
    }

    return res.status(200).json({
      users: data,
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      message: "Problems occured",
    });
  }
};

// updating data for testing purposes
const UPDATE_BY_ID = async (req, res) => {
  try {
    const data = await userModel.findOne({ id: req.params.id });

    if (!data) {
      return res.status(404).json({
        message: `user with id ${req.params.id} does not exist`,
      });
    }

    const response = await userModel.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body },
      { new: true }
    );

    return res.status(200).json({
      message: "updated",
      response: response,
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      message: "Problems occured",
    });
  }
};

export {
  SIGN_UP,
  LOGIN,
  GET_NEW_TOKEN,
  ALL_USERS,
  USER_BY_ID,
  UPDATE_BY_ID,
  ALL_USERS_WITH_TICKETS,
  USER_WITH_TICKETS_BY_ID,
};
