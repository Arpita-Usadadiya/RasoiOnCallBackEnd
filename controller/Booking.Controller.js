const Booking = require("../model/Booking.Model");
const Chef = require("../model/Chef.model");

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const { chefId, visitDate, visitTime, useCase, totalMembers, amount } =
      req.body;

    const booking = new Booking({
      chefId,
      visitDate,
      visitTime,
      useCase,
      totalMembers,
      amount,
      userId: req.user.userId,
      status: "pending", // ✅ FIXED
      paymentStatus: "pending",
      serviceStatus: "upcoming",
      chefArrivalTime: "Not assigned",
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET USER BOOKINGS
const getBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.userId,
    })
      .populate("chefId", "name")
      .sort({ createdAt: -1 });

    const now = new Date();

    bookings.forEach((b) => {
      if (b.status !== "accepted") {
        b.serviceStatus = "pending";
        return;
      }
      const visit = new Date(`${b.visitDate} ${b.visitTime}`);

      const endTime = new Date(visit);
      endTime.setHours(endTime.getHours() + 2); // lunch end time

      if (now > endTime) {
        b.serviceStatus = "completed";
      } else {
        b.serviceStatus = "upcoming";
      }
    });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};
// GET BY ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking" });
  }
};

// UPDATE
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (req.body.paymentStatus) {
      booking.paymentStatus = req.body.paymentStatus;
    }

    await booking.save();

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE
const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// CHEF: Get bookings assigned to logged-in chef
const getChefBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      chefId: req.user.userId,
    })
      .populate("userId", "name phone email addresses") // ✅ ADD THIS
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chef bookings" });
  }
};

// CHEF: Accept or Reject booking
const updateBookingStatus = async (req, res) => {
  try {
    console.log("Logged in user:", req.user);
    const chef = await Chef.findOne({ userId: req.user.userId });

    if (!chef) {
      return res.json({ success: false, message: "Chef not found" });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      chefId: chef._id,
    });

    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    booking.status = req.body.status;

    if (req.body.status === "accepted") {
      booking.serviceStatus = "upcoming";
      booking.chefArrivalTime = "30 minutes before booking";
    }

    if (req.body.status === "rejected") {
      booking.refundStatus = "requested";
      booking.chefArrivalTime = "Not assigned";
      booking.serviceStatus = "cancelled";
    }

    await booking.save();

    res.json({
      success: true,
      message: "Booking status updated",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// GET CHEF NOTIFICATIONS

const getChefNotifications = async (req, res) => {
  try {
    console.log("Logged in userId:", req.user.userId);
    const chef = await Chef.findOne({ userId: req.user.userId });

    if (!chef) {
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });
    }

    const bookings = await Booking.find({
      chefId: chef._id,
      status: "pending",
    }).populate("userId", "name email");

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
  getChefBookings,
  updateBookingStatus,
  getChefNotifications,
};
