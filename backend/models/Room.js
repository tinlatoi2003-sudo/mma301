const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    area: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["available", "reserved", "occupied"],
      default: "available"
    },
    imageUrl: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    facilities: {
      type: [String],
      default: []
    },
    managerName: {
      type: String,
      default: ""
    },
    managerPhone: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Room", roomSchema);
