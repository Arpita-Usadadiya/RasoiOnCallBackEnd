const router = require("express").Router();

const {
  createBooking,
  getBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
  getChefBookings,
  updateBookingStatus,
  getChefNotifications,
} = require("../controller/Booking.Controller");

const {
  verifyToken,
  isChef,
} = require("../middleware/Auth.Middleware");

router.post("/createBook", verifyToken, createBooking);
router.get("/get", verifyToken, getBooking);
router.get("/get/:id", verifyToken, getBookingById);
router.put("/update/:id", verifyToken, updateBooking);
router.delete("/delete/:id", verifyToken, deleteBooking);

// CHEF ROUTES
router.get("/chef-notifications", verifyToken, getChefNotifications);
router.get("/chef/bookings", verifyToken, isChef, getChefBookings);
router.put("/chef/status/:id", verifyToken, isChef, updateBookingStatus);

module.exports = router;
