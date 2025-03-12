import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const {fullname, username, email, password} = req.body;

    // if (!fullname || !username || !email || !password) {
    //   return res.status(400).json({ error: "Please fill the form."})
    // };
    
    // Email Verification Regex
    // username part + @ + domain name part + .~ top-level domain part
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken."});
    }

    const existingEmail = await User.findOne({ username });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken."})
    }

    // Validation
    if (password.length < 6) {
      return res.status(400).json({ error: "Password cannot be shorter than 6"})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        followings: newUser.followings,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg
      });
    } else {
      res.status(400).json({ error: "Invalid User."})
    }

  } catch (error) {
    res.status(500).json({ error: error.message })

  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordCorrect ){
      return res.status(400).json({ error: "Invalid username or password."})
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      followers: user.followers,
      followings: user.followings,
      profileImg: user.profileImg,
      coverImg: user.coverImg
    });

  } catch (error) {
    return res.status(500).json({ error : "Internal server error."})
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {maxAge: 0})
    res.status(200).json({ message: "Logout performed successfully."})
  } catch (error) {
    res.status(500).json({ error: "Internal server error."})
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
  }
}