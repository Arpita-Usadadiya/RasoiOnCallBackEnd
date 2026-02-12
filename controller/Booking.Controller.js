const Booking = require("../model/Booking.Model");

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
    } = req.body;

    const booking = new Booking({
      chefId,
      visitDate,
      visitTime,
      useCase,
      totalMembers,
      amount,
      userId: req.user.userId, // ✅ FIXED
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
      userId: req.user.userId, // ✅ FIXED
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
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
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

module.exports = {
  createBooking,
  getBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
};
