const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const http = require('http');
const { Server } = require("socket.io");
require('dotenv').config();

// Models
const User = require('./models/User');

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for dev
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(cors());

// Pass io to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ---------- TEST ROUTE ----------
app.get("/", (req, res) => {
  res.send("Backend is Working 🚀");
});

// ---------- ROUTES ----------
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/attendance', require('./routes/attendance'));

// ---------- CREATE DEFAULT ADMIN ----------
async function createDefaultAdmin() {

  try {
    const adminEmail = "admin@gmail.com";

    const exist = await User.findOne({ email: adminEmail });

    if (!exist) {

      const hash = await bcrypt.hash("admin123", 10);

      await User.create({
        name: "System Admin",
        email: adminEmail,
        password: hash,
        role: "admin"
      });

      console.log("✅ Default Admin Created");
      console.log("Login → admin@gmail.com / admin123");

    } else {
      console.log("✅ Admin Already Exists");
    }

  } catch (err) {
    console.log("Admin Create Error:", err.message);
  }
}

// ---------- CONNECT MONGO THEN START SERVER ----------
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO)
  .then(async () => {

    console.log("Mongo Connected");

    // Create admin only AFTER mongo connected
    await createDefaultAdmin();

    server.listen(PORT, () => {
      console.log("Server Running on " + PORT);
    });

  })
  .catch(err => {
    console.log("Mongo Error:", err.message);
  });
