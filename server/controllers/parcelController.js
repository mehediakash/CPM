const Parcel = require("../models/Parcel");
const User = require("../models/User");
const axios = require("axios");
const sendEmail = require("../utils/email"); // assumes you created this earlier

const GOOGLE_MAPS_API_KEY = "AIzaSyDlY82dZtF3EPsfAB847oKsKWEug0Mq4jM";


exports.createParcel = async (req, res) => {
  try {
    const {
      pickupAddress,
      deliveryAddress,
      parcelSize,
      parcelType,
      paymentMethod,
      codAmount,
      location,
    } = req.body;

    const locationHistory = [];

    if (location?.lat && location?.lng) {
      locationHistory.push({
        lat: location.lat,
        lng: location.lng,
        timestamp: new Date(),
      });
    }

    const parcel = await Parcel.create({
      customerId: req.user.id,
      pickupAddress,
      deliveryAddress,
      parcelSize,
      parcelType,
      paymentMethod,
      codAmount: paymentMethod === "COD" ? codAmount : 0,
      locationHistory,
    });

    
    const customer = await User.findById(req.user.id);
    if (customer?.email) {
      await sendEmail({
        to: customer.email,
        subject: "📦 Parcel Booked Successfully",
        html: `
          <h3>Hello ${customer.name || ""},</h3>
          <p>Your parcel has been booked successfully!</p>
          <ul>
            <li><strong>Tracking ID:</strong> ${parcel._id}</li>
            <li><strong>Pickup Address:</strong> ${pickupAddress}</li>
            <li><strong>Delivery Address:</strong> ${deliveryAddress}</li>
            <li><strong>Payment Method:</strong> ${paymentMethod}</li>
            ${
              paymentMethod === "COD"
                ? `<li><strong>COD Amount:</strong> ৳${codAmount}</li>`
                : ""
            }
          </ul>
          <p>Thank you for choosing our service!</p>
        `,
      });
    }

    res.status(201).json(parcel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



exports.getMyParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.json(parcels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getParcelById = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json({ message: "Parcel not found" });
    res.json(parcel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find()
      .populate("customerId", "name email")
      .populate("assignedAgent", "name email")
      .sort({ createdAt: -1 });

    res.json(parcels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.assignAgent = async (req, res) => {
  try {
    const { parcelId } = req.params;
    const { agentId } = req.body;

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent") {
      return res.status(400).json({ message: "Invalid agent ID" });
    }

    const parcel = await Parcel.findByIdAndUpdate(
      parcelId,
      { assignedAgent: agentId },
      { new: true }
    );

    res.json({ message: "Agent assigned", parcel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAssignedParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ assignedAgent: req.user.id })
      .populate("customerId");
    res.json(parcels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateParcelStatus = async (req, res) => {
  try {
    const { parcelId } = req.params;
    const { status, lat, lng } = req.body;

    const parcel = await Parcel.findById(parcelId).populate("customerId");

    if (!parcel) return res.status(404).json({ message: "Parcel not found" });

    if (String(parcel.assignedAgent) !== req.user.id) {
      return res.status(403).json({ message: "You are not assigned to this parcel" });
    }

    parcel.status = status;

    if (lat && lng) {
      parcel.locationHistory.push({ lat, lng, timestamp: new Date() });
    }

    await parcel.save();

    
    if (parcel.customerId?.email) {
      await sendEmail({
        to: parcel.customerId.email,
        subject: `📦 Parcel Status Updated: ${status}`,
        html: `
          <h3>Hello ${parcel.customerId.name || ""},</h3>
          <p>Your parcel with tracking ID <strong>${parcel._id}</strong> has been updated to:</p>
          <h4>${status}</h4>
          <p>We’ll keep you updated. Thank you!</p>
        `,
      });
    }

    res.json({ message: "Status updated", parcel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



exports.getOptimizedRoute = async (req, res) => {
  try {
    const agentId = req.user.id;
    const parcels = await Parcel.find({
      assignedAgent: agentId,
      status: { $ne: "Delivered" }, 
    });

    if (!parcels.length) {
      return res.status(404).json({ message: "No active parcels" });
    }

    const addresses = parcels.map(p => p.deliveryAddress).filter(Boolean);
    if (addresses.length < 2) {
      return res.json({ route: addresses });
    }

    const origin = addresses[0];
    const destinations = addresses.slice(1).join('|');

    const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json`, {
      params: {
        origin,
        destination: origin,
        waypoints: `optimize:true|${destinations}`,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    const route = response.data.routes?.[0];
    if (!route) {
      return res.status(500).json({ message: "Failed to generate route" });
    }

    const ordered = route.waypoint_order.map(i => addresses[i + 1]);
    const finalRoute = [origin, ...ordered];

    res.json({ route: finalRoute, summary: route.summary });
  } catch (err) {
    console.error("Route Error:", err);
    res.status(500).json({ error: "Failed to generate optimized route." });
  }
};

