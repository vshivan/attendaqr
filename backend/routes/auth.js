const r = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

r.post('/register', async (req,res)=>{
  req.body.password = await bcrypt.hash(req.body.password,10);
  await User.create(req.body);
  res.send("created");
});

r.post('/login', async (req,res)=>{

  const u = await User.findOne({ email:req.body.email });
  if(!u) return res.send("no");

  const ok = await bcrypt.compare(req.body.password,u.password);
  if(!ok) return res.send("no");

  const t = jwt.sign(
    { id:u._id, role:u.role },
    process.env.JWT_SECRET
  );

  res.send({ token:t, role:u.role });
});

module.exports = r;
