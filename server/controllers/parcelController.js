const Parcel = require("../models/Parcel");
const User = require("../models/User");
const moment = require("moment");
const { parse } = require("json2csv");
const axios = require("axios");
const PDFDocument = require("pdfkit");
const GOOGLE_MAPS_API_KEY = "AIzaSyDlY82dZtF3EPsfAB847oKsKWEug0Mq4jM";

// 1. Create Parcel (Customer)
exports.createParcel = async (req, res) => {
  try {
    const {
      pickupAddress,
      deliveryAddress,
      parcelSize,
      parcelType,
      paymentMethod,
      codAmount,
    } = req.body;

    const parcel = await Parcel.create({
      customerId: req.user.id,
      pickupAddress,
      deliveryAddress,
      parcelSize,
      parcelType,
      paymentMethod,
      codAmount: paymentMethod === "COD" ? codAmount : 0,
    });

    res.status(201).json(parcel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Get My Parcels (Customer)
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

// 3. Get All Parcels (Admin)
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

// 4. Assign Agent (Admin)
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
    const parcels = await Parcel.find({ assignedAgent: req.user.id });
    res.json(parcels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 5. Update Parcel Status (Agent)
exports.updateParcelStatus = async (req, res) => {
  try {
    const { parcelId } = req.params;
    const { status, lat, lng } = req.body;

    const parcel = await Parcel.findById(parcelId);

    if (!parcel) return res.status(404).json({ message: "Parcel not found" });

    // Optional: only update if this agent is assigned
    if (String(parcel.assignedAgent) !== req.user.id) {
      return res.status(403).json({ message: "You are not assigned to this parcel" });
    }

    parcel.status = status;

  if (lat && lng) {
  parcel.locationHistory.push({ lat, lng, timestamp: new Date() });
}

    await parcel.save();

    res.json({ message: "Status updated", parcel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMetrics = async (req, res) => {
  try {
    const today = moment().startOf("day");
    const tomorrow = moment(today).add(1, "days");
    const daily = await Parcel.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } });
    const failed = await Parcel.countDocuments({ status: "Failed" });
    const codAmountAgg = await Parcel.aggregate([
      { $match: { paymentType: "COD" } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    const codAmount = codAmountAgg[0]?.total || 0;

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const day = moment().subtract(i, "days").startOf("day");
      const next = moment(day).add(1, "days");
      const count = await Parcel.countDocuments({ createdAt: { $gte: day.toDate(), $lt: next.toDate() } });
      last7Days.push({ date: day.format("MMM D"), count });
    }

    res.json({ daily, failed, codAmount, last7Days });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch metrics." });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const parcels = await Parcel.find().populate("customerId", "email");

    const data = parcels.map((p) => ({
      ID: p._id,
      Customer: p.customerId?.email || "N/A",
      Status: p.status,
      Payment: p.paymentMethod,
      CODAmount: p.codAmount,
      CreatedAt: p.createdAt
    }));

    const csv = parse(data);
    res.header("Content-Type", "text/csv");
    res.attachment("parcels.csv");
    res.send(csv);
  } catch (err) {
    console.error("CSV Export Error:", err);
    res.status(500).json({ error: "Failed to export CSV." });
  }
};


exports.exportPDF = async (req, res) => {
  try {
    const parcels = await Parcel.find().populate("customerId", "email");
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=parcels.pdf");
    doc.pipe(res);
    doc.fontSize(16).text("Parcel Report", { align: "center" });
    doc.moveDown();
    parcels.forEach((p, i) => {
      doc.fontSize(10).text(
        `${i + 1}. ${p._id} - ${p.customerId?.email || "N/A"} - ${p.status} - ${p.paymentMethod} - ৳${p.codAmount}`
      );
    });
    doc.end();
  } catch (err) {
    console.error("PDF Export Error:", err);
    res.status(500).json({ error: "Failed to export PDF." });
  }
};

exports.getOptimizedRoute = async (req, res) => {
  try {
    const agentId = req.user.id;
    const parcels = await Parcel.find({
      assignedAgent: agentId,
      status: { $ne: "Delivered" }, // exclude delivered
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

