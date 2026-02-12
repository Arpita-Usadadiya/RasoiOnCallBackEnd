const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const createError = require("http-errors");
require("dotenv").config();

const connectDB = require("./config/db");

// ROUTES
const UserRoutes = require("./routes/User.route");
const BlogRoutes = require("./routes/Blog.route");
const TestimonialRoutes = require("./routes/Testimonial.route");
const GalleryRoutes = require("./routes/Gallery.route");
const CrouselRoutes = require("./routes/Crousel.route");
const ChefRoutes = require("./routes/Chef.route");
const BookingRoutes = require("./routes/Booking.route");

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* -------------------- DB -------------------- */
connectDB();

/* -------------------- TEST ROUTE -------------------- */
app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});

/* -------------------- API ROUTES -------------------- */
app.use("/auth", UserRoutes);
app.use("/blog", BlogRoutes);
app.use("/testimonial", TestimonialRoutes);
app.use("/gallery", GalleryRoutes);
app.use("/crousel", CrouselRoutes);
app.use("/chef", ChefRoutes);
app.use("/booking", BookingRoutes);     // protected booking routes

/* -------------------- 404 HANDLER -------------------- */
app.use((req, res, next) => {
  next(createError.NotFound("Route not found"));
});

/* -------------------- ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || "Internal Server Error",
  });
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
