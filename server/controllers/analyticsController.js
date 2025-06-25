const Parcel = require("../models/Parcel");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

exports.getAnalytics = async (req, res) => {
  try {
    const totalParcels = await Parcel.countDocuments();
    const codTotal = await Parcel.aggregate([
      { $match: { paymentMethod: "COD" } },
      { $group: { _id: null, total: { $sum: "$codAmount" } } },
    ]);
    const failedDeliveries = await Parcel.countDocuments({ status: "Failed" });
    const delivered = await Parcel.countDocuments({ status: "Delivered" });

    res.json({
      totalParcels,
      codTotal: codTotal[0]?.total || 0,
      failedDeliveries,
      delivered,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const parcels = await Parcel.find().populate("customerId", "name email");
    const fields = [
      "customerId.name",
      "pickupAddress",
      "deliveryAddress",
      "status",
      "paymentMethod",
      "codAmount",
      "createdAt",
    ];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(parcels);

    res.header("Content-Type", "text/csv");
    res.attachment("parcel-report.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.exportPDF = async (req, res) => {
  try {
    const parcels = await Parcel.find().populate("customerId", "name email");

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

    doc.pipe(res);

    doc.fontSize(18).text("Parcel Report", { align: "center" });
    doc.moveDown();

    parcels.forEach((p, i) => {
      doc
        .fontSize(12)
        .text(
          `${i + 1}. ${p.customerId?.name || "Unknown"} | ${p.pickupAddress} → ${p.deliveryAddress} | ${p.status} | ${p.paymentMethod}`
        );
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
