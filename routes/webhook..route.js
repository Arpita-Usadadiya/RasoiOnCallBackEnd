const express = require("express");
const router = express.Router();
const Booking = require("../model/Booking.Model");

router.post("/stripe-webhook", async (req, res) => {

  const event = req.body;

  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    const bookingId = session.metadata.bookingId;

    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: "paid"
    });

  }

  res.json({ received: true });
});

module.exports = router;