const r = require('express').Router();
const A = require('../models/Attendance');

r.post('/scan', async (req,res)=>{

  const { userId } = req.body;
  const d = new Date().toDateString();

  let a = await A.findOne({ userId, date:d });

  if(!a){
    await A.create({
      userId,
      date:d,
      inTime:new Date().toLocaleTimeString(),
      status:"present"
    });

    return res.send("IN Marked");
  }

  if(!a.outTime){
    a.outTime = new Date().toLocaleTimeString();
    await a.save();

    return res.send("OUT Marked");
  }

  res.send("Already Done");
});

module.exports = r;
