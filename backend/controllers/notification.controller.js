import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    // get notes
    const userId = req.user._id;
    const notifications = await Notification.find({ to:userId }).populate({
      "path": "from",
      select: "username profileImg"
    });

    // mark notes to be read & show them
    await Notification.updateMany({ to:userId}, { read:true });
    res.status(200).json(notifications);

  } catch (error) {
    console.log(error.message);
    res.status(500).json({error: "Internal server error."});
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    // check user
    const userId = req.user._id;

    // delete notes
    await Notification.deleteMany({ to:userId });
    res.status(200).json({message: "Notifications deleted Successfully."})

  } catch (error) {
    console.log(error.message);
    res.status(500).json({error: "Internal server error."});
  }
};

