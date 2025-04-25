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
    return res.status(200).json(notifications);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({error: "Internal server error."});
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    // check user
    const userId = req.user._id;

    // delete notes
    await Notification.deleteMany({ to:userId });
    return res.status(200).json({message: "Notifications deleted Successfully."})

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({error: "Internal server error."});
  }
};

export const deleteNotification = async (req, res) => {
  try {
    // check user and get single note
    const userId = req.user._id;
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({error: "Notification not found."})
    }
    if (notification.to.toString() !== userId.toString()) {
      return res.status(401).json({error: "You are not authorized."});
    }

    await Notification.findByIdAndDelete(id);
    return res.status(200).json({message: "Notification deleted."});
    
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({error: "Internal server error."});
    
  }
};
