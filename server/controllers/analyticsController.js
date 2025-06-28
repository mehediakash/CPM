const Parcel = require("../models/Parcel");

exports.getMetrics = async (req, res) => {
  try {
    const today = new Date();
    const startDate = new Date(today.setDate(today.getDate() - 29));
    startDate.setHours(0, 0, 0, 0);

    // Get all picked-up parcels in the last 30 days
    const pickedUpParcels = await Parcel.find({
      createdAt: { $gte: startDate },
      status: "Picked Up",
    }).populate("customerId", "name"); // populate customer name

    // Filter valid parcel entries grouped by date
    const pickedUpData = [];

    const groupedByDate = {};
    pickedUpParcels.forEach((parcel) => {
      const dateStr = new Date(parcel.createdAt).toISOString().split("T")[0];
      if (!groupedByDate[dateStr]) {
        groupedByDate[dateStr] = [];
      }
      groupedByDate[dateStr].push(parcel);
    });

    for (const date in groupedByDate) {
      pickedUpData.push({
        date,
        count: groupedByDate[date].length,
      });
    }

    const totalCOD = pickedUpParcels.reduce(
      (sum, p) => sum + (p.codAmount || 0),
      0
    );

    const failedDeliveries = await Parcel.countDocuments({
      createdAt: { $gte: startDate },
      status: "Failed",
    });

    res.json({
      totalPickedUp: pickedUpParcels.length,
      failed: failedDeliveries,
      totalCOD,
      pickedUpData,
      details: pickedUpParcels.map((p) => ({
        _id: p._id,
        customerId: {
          name: p.customerId?.name || "N/A",
        },
        pickupAddress: p.pickupAddress,
        deliveryAddress: p.deliveryAddress,
        parcelType: p.parcelType,
        paymentType: p.paymentType,
        codAmount: p.codAmount || 0,
      })),
    });
  } catch (err) {
    console.error("Error fetching analytics metrics:", err);
    res.status(500).json({ error: "Failed to fetch analytics metrics" });
  }
};
