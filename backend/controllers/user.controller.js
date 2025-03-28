import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js"

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = User.findOne();    
  } catch (error) {
    return res.status(500).json({error: "Internal server error."})
  }

};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersfollowedByMe = User.findById(userId).select("following");
    const users = await User.aggregate([
      {$match: {
        _id: {$ne:userId},
      }},
      {$sample: {
        size: 10,
      }},
    ]);

    const filteredUsers = users.filter(user => usersfollowedByMe.followings.includes(user._id));
    const suggestedUsers = filteredUsers.slice(0,4);
    suggestedUsers.forEach(user => user.password=null);
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({error: "Internal server error."})
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    // check try following self
    if (id === req.user._id.toString()) {
      return res.status(400).json({error: "You cannot follow yourself."})
    }
    
    // check 
    if (!userToModify || !currentUser) {
      return res.status(404).json({error: "User not found."})
    }

    const isFollowing = currentUser.followings.includes(id);
    if (isFollowing) {
      // perform unfollow
      await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}});
      await User.findByIdAndUpdate(req.user._id, {$pull: {followings: id}});
      return res.status(200).json({ message: "User unfollowed."});

    } else {
      // perform follow
      await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}})
      await User.findByIdAndUpdate(req.user._id, {$push: {followings: id}})

      // perform note
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id
      });
      await newNotification.save();

      return res.status(200).json({ message: "User followed."});
    }

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({error: "Internal server error."})
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const { fullname, email, username, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    try {
      let user = await User.findById(userId);
      if (!user) return res.status(404).json({error: "User not found."})
      
      if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
        return res.status(400).json({error: "Please provide both current and new password."})
      }

      // Password update
      if (currentPassword && newPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({error: "Current password is not correct."})
        if (newPassword.length < 6) {
          return res.status(400).json({error: "New password should not be shorter than 6."})
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
      }

      user.fullname = fullname || user.fullname;
      user.email = email || user.email;
      user.username = username || user.username;
      user.bio = bio || user.bio;
      user.link = link || user.link;
      user.profileImg = profileImg || user.profileImg;
      user.coverImg = coverImg || user.coverImg;

      // update user
      user = await user.save();

      // password should not be passed
      user.password = null;
      return res.status(200).json(user)      
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({error: "Internal server error."});
    }

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({error: "Internal server error."});
  }
};