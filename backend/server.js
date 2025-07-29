const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const bookRoutes = require("./routes/bookRoutes.js");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Setup CORS with frontend URL
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Global socket instance (accessible from routes if needed)
app.set("io", io);

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/books", bookRoutes);

// WebSocket Setup
io.on("connection", (socket) => {
  console.log("🔌 A user connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected: ", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
