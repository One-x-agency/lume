const DB = require("../models")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const transport = require("../utils/mailer")
require("dotenv").config()

// ✅ Password Regex
const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

const signupController = async (req, res) => {
  try {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    // ✅ Password validation
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and contain 1 special character"
      })
    }

    const existingUser = await DB.USER.findOne({ email })

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await DB.USER.create({
      name,
      email,
      password: hashedPassword,
      role: "USER"
    })

    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome",
      text: `Hello ${name}, welcome to LUME`
    })

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Something went wrong"
    })
  }
}

const signinController = async (req, res) => {
  try {

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      })
    }

    const user = await DB.USER.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        message: "Password incorrect"
      })
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({
      message: "Signin successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Something went wrong"
    })
  }
}

const forgetPassword = async (req, res) => {
  try {

    const { email } = req.body

    const user = await DB.USER.findOne({ email })

    if (!user) {
      return res.json({
        message: "User not found"
      })
    }

    const otp = Math.floor(100000 + Math.random() * 900000)

    user.otp = otp
    user.otpExpire = Date.now() + 5 * 60 * 1000

    await user.save()

    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}`
    })

    res.json({
      message: "OTP sent to email"
    })

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    })
  }
}

const verifyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body

    const user = await DB.USER.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    if (user.otp != otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      })
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        message: "OTP expired"
      })
    }

    res.json({
      message: "OTP verified"
    })

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    })
  }
}

const resetPassword = async (req, res) => {
  try {

    const { email, newPassword } = req.body

    const user = await DB.USER.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    // ✅ Password validation
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and contain 1 special character"
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword
    user.otp = null
    user.otpExpire = null

    await user.save()

    res.json({
      message: "Password reset successful"
    })

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await DB.USER.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await DB.USER.countDocuments();
    const totalProducts = await DB.CLOTHES.countDocuments();
    const totalCategories = await DB.CATEGORY.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalCategories
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching admin stats" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await DB.USER.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

module.exports = {
  signupController,
  signinController,
  forgetPassword,
  verifyOtp,
  resetPassword,
  getAllUsers,
  getAdminStats,
  deleteUser
}