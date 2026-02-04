const r = require('express').Router();
const QR = require('qrcode');

const User = require('../models/User');
const A = require('../models/Attendance');

// 1. GENERATE QR
r.post('/generate-qr', async (req,res)=>{

  const payload = {
    userId: req.body.userId,
    date: new Date().toDateString()
  };

  const qr = await QR.toDataURL(
    JSON.stringify(payload)
  );

  res.send(qr);
});


// 2. DASHBOARD STATS
r.get('/stats', async (req,res)=>{

  const today = new Date().toDateString();

  const total = await User.countDocuments({
    role:"student"
  });

  const present = await A.countDocuments({
    date: today
  });

  res.send({
    total,
    present,
    absent: total - present
  });
});


// 3. TODAY LIST
r.get('/list', async (req,res)=>{

  const today = new Date().toDateString();

  const data = await A.find({ date: today });

  res.send(data);
});

module.exports = r;
