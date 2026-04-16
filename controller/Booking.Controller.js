const Booking = require("../model/Booking.Model");
const Chef = require("../model/Chef.model");
const mongoose = require("mongoose");

// CREATE BOOKING
const createBooking = async (req, res) => {


  try {

    const {
      chefId,
      visitDate,
      visitTime,
      useCase,
      totalMembers,
      amount,
      extraUtensils,
      ingredientsNeeded,
      bbqSetup,
      waiters,
      deepCleaning,
      groceryShopping,
    } = req.body;

    // Validate chefId exists and is a valid ObjectId
if (!mongoose.Types.ObjectId.isValid(chefId)) {
  return res.status(400).json({
    success: false,
    message: "Invalid chefId",
  });
}

const chef = await Chef.findById(chefId);

if (!chef) {
  return res.status(404).json({
    success: false,
    message: "Chef not found",
  });
}

    const bookingDateTime = new Date(`${visitDate} ${visitTime}`);
    const now = new Date();

    if (bookingDateTime < now) {
      return res.status(400).json({
        success: false,
        message: "Cannot book for past time",
      });
    }

    const booking = new Booking({
      chefId,
      chefUserId: chef.userId,
      visitDate,
      visitTime,
      useCase,
      totalMembers,
      amount,
      extraUtensils,
      ingredientsNeeded,
      bbqSetup,
      waiters,
      deepCleaning,
      groceryShopping,
      userId: req.user.userId,
      status: "pending", // ✅ FIXED
      paymentStatus: "pending",
      serviceStatus: "upcoming",
      chefArrivalTime: "Not assigned",
    });

    const existingBooking = await Booking.findOne({
  chefId,
  visitDate,
  visitTime,
  status: { $in: ["pending", "accepted"] }
});

if (existingBooking) {
  return res.status(400).json({
    success: false,
    message: "This time slot is already booked"
  });
}

    await booking.save();
    console.log("ChefId received:", chefId);
console.log("UserId:", req.user.userId);

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
      if (b.status === "completed") {
        b.serviceStatus = "completed";
        return;
      }

      if (b.status === "cancelled" || b.status === "rejected") {
        b.serviceStatus = "cancelled";
        return;
      }

      if (b.status === "pending") {
        b.serviceStatus = "pending";
        return;
      }

      const visit = new Date(`${b.visitDate} ${b.visitTime}`);

      const endTime = new Date(visit);
      endTime.setHours(endTime.getHours() + 2);

      if (new Date() > endTime) {
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
    const chef = await Chef.findOne({ userId: req.user.userId });

    if (!chef) {
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });
    }

    const bookings = await Booking.find({
      chefId: chef._id,
    })
      .populate("userId", "name phone email addresses")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch chef bookings",
    });
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
      booking.refundStatus = "initiated";
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
    const chef = await Chef.findOne({ userId: new mongoose.Types.ObjectId(req.user.userId)});

    if (!chef) {
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });
    }

    const bookings = await Booking.find({
      chefId: chef._id,
      status: "pending",
    })
      .populate("userId", "name email")
      .populate("userId", "name email phone addresses")
      .sort({ createdAt: -1 });

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

const getChefAllBookings = async (req, res) => {
  try {

    console.log("Logged-in userId:", req.user.userId, typeof req.user.userId);

    // find chef using logged in user
    const chef = await Chef.findOne({ userId: req.user.userId });

    console.log("Chef found:", chef);

    if (!chef) {
      return res.status(404).json({
        success: false,
        message: "Chef not found"
      });
    }

    const bookings = await Booking.find({
      chefId: chef._id
    })
    .populate("userId", "name phone addresses")
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const autoCancelBookings = async () => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const bookings = await Booking.find({
      status: "pending",
      createdAt: { $lte: thirtyMinutesAgo },
      paymentStatus: "paid",
    });

    for (let booking of bookings) {
      booking.status = "cancelled";
      booking.refundStatus = "initiated";

      await booking.save();
    }
  } catch (error) {
    console.log(error);
  }
};

const getBookedSlots = async (req, res) => {
  try {
    const { chefId, date } = req.query;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      chefId,
      visitDate: { $gte: start, $lte: end },
      status: { $nin: ["cancelled", "rejected"] },
    });

    const slots = bookings.map((b) => b.visitTime);

    res.json(slots);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching slots" });
  }
};

const completeService = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "completed";
    booking.serviceStatus = "completed";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Service marked as completed",
      data: booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
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
  autoCancelBookings,
  getBookedSlots,
  completeService,
  getChefAllBookings,
};
