const express = require("express");
const router = express.Router();

const {
  createChef,
  getAllChef,
  getById,
  updateChef,
  deleteCheftById,
  deleteAllChef,
  smartMatchChefs,
  chefsNearMe,
} = require("../controller/Chef.controller");

const Chef = require("../model/Chef.model");
const Booking = require("../model/Booking.Model");

const {
  verifyToken,
  isChef,
  isAdmin,
} = require("../middleware/Auth.Middleware");

/* ===========================
   🔴 YOUR EXISTING ROUTES
   (UNCHANGED)
=========================== */

router.post('/createChef', verifyToken, createChef)
router.get("/getAll", getAllChef);
router.get("/get/:id", getById);
router.put("/update/:id", updateChef);
router.delete("/delete/:id", deleteCheftById);

router.delete("/delete", deleteAllChef);

router.get("/near-me", chefsNearMe);

router.get("/filter", async (req, res) => {
  const { minHygiene } = req.query;

  try {
    const chefs = await Chef.find({
      hygieneScore: { $gte: Number(minHygiene) },
    });

    res.json(chefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/smart-match", smartMatchChefs);

/* ===========================
   🟢 NEW ROUTES (ADDED)
=========================== */

/* 🔐 Create chef profile (AUTH REQUIRED) */
router.post(
  "/createChef-auth",
  verifyToken,
  isChef,
  async (req, res) => {
    try {
      const exists = await Chef.findOne({ userId: req.user.userId });
      if (exists) {
        return res.status(400).json({ message: "Chef already exists" });
      }

      const chef = new Chef({
        ...req.body,
        userId: req.user.userId, // 🔑 FIXES YOUR ERROR
      });

      await chef.save();
      res.status(201).json({ success: true, chef });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* 👤 Logged-in chef profile */
router.get("/me", verifyToken, isChef, async (req, res) => {
  try {
    const chef = await Chef.findOne({ userId: req.user.userId });

    if (!chef) {
      return res.status(404).json({ message: "Chef profile not found" });
    }

    res.json({ success: true, data: chef });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* 📦 Chef dashboard → bookings */
router.get("/my-bookings", verifyToken, isChef, async (req, res) => {
  try {
    const chef = await Chef.findOne({ userId: req.user.userId });
    if (!chef) {
      return res.status(404).json({ message: "Chef profile not found" });
    }

    const bookings = await Booking.find({ chefId: chef._id })
      .populate("userId", "name phone address");

    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* 🟢 Toggle availability */
router.patch("/availability", verifyToken, isChef, async (req, res) => {
  try {
    const chef = await Chef.findOneAndUpdate(
      { userId: req.user.userId },
      { availability: req.body.availability },
      { new: true }
    );

    res.json({ success: true, data: chef });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* 🧑‍💼 ADMIN: Pending chefs */
router.get("/pending", verifyToken, isAdmin, async (req, res) => {
  const chefs = await Chef.find({ approved: false });
  res.json({ chefs });
});

/* ✅ ADMIN: Approve chef */
router.patch("/approve/:id", verifyToken, isAdmin, async (req, res) => {
  await Chef.findByIdAndUpdate(req.params.id, { approved: true });
  res.json({ message: "Chef approved" });
});

module.exports = router;


// const { createChef, getAllChef, getById, updateChef, deleteCheftById, deleteAllChef, smartMatchChefs, chefsNearMe } = require('../controller/Chef.controller');
// const Chef = require("../model/Chef.model");

// const router = require('express').Router();


// router.post('/createChef', createChef);
// router.get('/getAll', getAllChef);
// router.get('/get/:id', getById);
// router.put('/update/:id', updateChef);
// router.delete('/delete/:id', deleteCheftById);
// router.delete('/delete', deleteAllChef);
// router.get("/near-me", chefsNearMe);
// router.get("/filter", async (req, res) => {
//   const { minHygiene } = req.query;

//   try {
//     const chefs = await Chef.find({
//       hygieneScore: { $gte: Number(minHygiene) }
//     });

//     res.json(chefs);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.get("/smart-match", smartMatchChefs);



// module.exports = router;