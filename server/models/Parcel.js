const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pickupAddress: String,
  deliveryAddress: String,
  parcelSize: String,
  parcelType: String,
  paymentMethod: { type: String, enum: ["COD", "Prepaid"] },
  codAmount: Number,
  status: {
    type: String,
    enum: ["Pending", "Picked Up", "In Transit", "Delivered", "Failed"],
    default: "Pending",
  },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  locationHistory: [
    {
      lat: Number,
      lng: Number,
      timestamp: Date,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Parcel", parcelSchema);
