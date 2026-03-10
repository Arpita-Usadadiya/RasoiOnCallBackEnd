// model/Booking.Model.js

const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    visitDate: {
      type: String,
      required: true,
    },

    visitTime: {
      type: String,
      required: true,
    },

    chefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chef",
      required: true,
    },

    useCase: {
      type: String,
      enum: ["One Time Cooking", "Party Chef", "Cook For A Month"],
      required: true,
    },

    totalMembers: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      default: "unpaid",
    },

    serviceStatus: {
      type: String,
      default: "upcoming",
    },

    chefArrivalTime: {
      type: String,
    },
    refundStatus: {
  type: String,
  default: "none"
}
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Booking", BookingSchema);
