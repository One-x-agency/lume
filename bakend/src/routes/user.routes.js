const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DB = require("../models");
const { signupController, signinController, forgetPassword, verifyOtp, resetPassword, getAllUsers, getAdminStats, deleteUser } = require("../controller/user.controller");
const router = express.Router();
const app = express();
app.use(express.json());

router.post("/signup",signupController );

router.post("/signin", signinController );

router.post("/forgot",forgetPassword);

router.post("/verify",verifyOtp);

router.post("/reset",resetPassword);

router.get("/all", getAllUsers);

router.get("/stats", getAdminStats);

router.delete("/delete/:id", deleteUser);

module.exports = router;