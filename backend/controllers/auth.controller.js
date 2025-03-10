import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const {fullname, username, email, password} = req.body;

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
    res.status(500).json({ error: "Internal Server Error."})

  }

  res.json({
    "data": "You hit the signup endpoint."
  });
};

export const login = async (req, res) => {
  res.json({
    "data": "You hit the login endpoint."
  });
};

export const logout = async (req, res) => {
  res.json({
    "data": "You hit the logout endpoint."
  });
};
