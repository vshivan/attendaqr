const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  userId: String,
  date: String,
  inTime: String,
  outTime: String,
  status: String
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
