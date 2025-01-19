const express = require("express");
const router = express.Router();
const { User, Attendance } = require("../models/models");
const auth = require("../middleware/auth");

// Get attendance for current month
router.get("/", auth, async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const attendances = await Attendance.find({
      userId: req.user._id,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    res.json({
      success: true,
      data: attendances.map((a) => a.date),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Mark attendance
router.post("/attendance", auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already marked attendance today
    const existingAttendance = await Attendance.findOne({
      userId: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Already marked attendance today",
      });
    }

    // Create new attendance record
    const attendance = new Attendance({
      userId: req.user._id,
      date: today,
    });
    await attendance.save();

    // Add 100 xu to user
    const user = await User.findById(req.user._id);
    user.xu += 100;
    await user.save();

    res.json({
      success: true,
      message: "Attendance marked successfully",
      newBalance: user.xu,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
