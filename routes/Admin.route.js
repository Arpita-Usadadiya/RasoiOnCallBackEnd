const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllBookings,
} = require("../controller/Admin.controller");

const { verifyToken, isAdmin } = require("../middleware/Auth.Middleware");

router.get("/dashboard", verifyToken, isAdmin, getDashboardStats);
router.get("/bookings", verifyToken, isAdmin, getAllBookings);

module.exports = router;