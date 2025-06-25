const Parcel = require("../models/Parcel");
const User = require("../models/User");

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
