const Notification = require("../models/notification.model");
const { error, success } = require("../services/responseSerivce");

module.exports = {
  getNotifications: async (req, res) => {
    try {
      const notifications = await Notification.find({
        receiver: req.user._id,
      }).sort({ createdAt: -1 });

      return success(
        200,
        "Notifications fetched successfully",
        notifications,
        res,
      );
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },

  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;

      const notification = await Notification.findById(id);

      if (!notification) {
        return error(404, "Notification not found", null, res);
      }

      notification.isRead = true;

      await notification.save();

      return success(200, "Notification marked as read", notification, res);
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },
};
