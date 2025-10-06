const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
reportedUserId: String,
reporterUserId: String,
reason: String,
comment: String,
createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", ReportSchema);
