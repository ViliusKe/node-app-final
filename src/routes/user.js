import express from "express";
import {
  SIGN_UP,
  LOGIN,
  GET_NEW_TOKEN,
  ALL_USERS,
  USER_BY_ID,
} from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", SIGN_UP);

router.post("/login", LOGIN);

router.post("/getNewJwtToken", GET_NEW_TOKEN);

router.get("/getAllUsers", auth, ALL_USERS);

router.get("/getUserById/:id", auth, USER_BY_ID);

export default router;
