// routes/Booking.route.js

const router = require("express").Router();
const verifyToken = require("../middleware/Auth.Middleware");

const {
  createBooking,
  getBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require("../controller/Booking.Controller");

router.post("/createBook", verifyToken, createBooking);
router.get("/get", verifyToken, getBooking);
router.get("/get/:id", verifyToken, getBookingById);
router.put("/update/:id", verifyToken, updateBooking);
router.delete("/delete/:id", verifyToken, deleteBooking);

module.exports = router;
