import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//Register User :api/user/register

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, msg: "Missing Details" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, msg: "User Already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, //prevent javscript to access cookie
      secure: process.env.NODE_ENV === "production", //use secure cookie in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF production
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expire
    });
    res.json({ success: true, user: { email: user.email, name: user.name } });
  } catch (error) {
    console.log(error.message);

    res.json({ success: false, msg: error.message });
  }
};

//login user : /api/user/login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        msg: "Email and Password are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, msg: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //use secure cookie in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF production
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expire
    });
    res.json({ success: true, user: { email: user.email, name: user.name } });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, msg: error.message });
  }
};

//check auth :api/user/is-auth

export const isAuth = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).select("-password");
    res.json({ success: true, user });


  } catch (error) {
    console.log(error.message);
    res.json({ success: false, msg: error.message });
  }
}

//logout user :api/user/logout

export const logout = async (req, res) => { 
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });


    return res.json({ success: true, msg: 'Logged out successfully'})
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, msg: error.message });
  }
}