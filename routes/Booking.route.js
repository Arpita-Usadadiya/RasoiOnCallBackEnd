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
  getBookedSlots,
  completeService,
  getChefAllBookings,
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
router.get("/booked-slots", getBookedSlots);
router.put("/complete/:id", verifyToken, completeService);

// CHEF ROUTES
router.get("/chef-notifications", verifyToken, getChefNotifications);
router.get("/chef/bookings", verifyToken, isChef, getChefBookings);
router.put("/chef/status/:id", verifyToken, isChef, updateBookingStatus);
router.get("/chef/all", verifyToken, isChef, getChefAllBookings); 


module.exports = router;
