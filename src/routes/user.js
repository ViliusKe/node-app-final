import express from "express";
import { SIGN_UP, LOGIN, GET_NEW_TOKEN } from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", SIGN_UP);

router.post("/login", LOGIN);

router.post("/getNewJwtToken", GET_NEW_TOKEN);

export default router;
