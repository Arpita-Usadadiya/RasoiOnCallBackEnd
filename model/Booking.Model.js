const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    chefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chef",
      required: true,
    },

    chefUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    visitDate: {
      type: String,
    },

    visitTime: {
      type: String,
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
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
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
      default: "none",
    },

    extraUtensils: {
      type: Boolean,
      default: false,
    },

    ingredientsNeeded: {
      type: Boolean,
      default: false,
    },

    bbqSetup: {
      type: Boolean,
      default: false,
    },

    waiters: {
      type: Number,
      default: 0,
    },

    deepCleaning: {
      type: Boolean,
      default: false,
    },

    groceryShopping: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Booking", BookingSchema);
