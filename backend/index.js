require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const rateLimit = require("express-rate-limit");

connectDB();

const app = express();
const server = http.createServer(app);

// 1. Security: Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// 2. CORS Configuration
const allowedOriginsEnv = process.env.CORS_ALLOWED_ORIGINS || "";
const allowedOrigins = allowedOriginsEnv.split(",");

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// 3. Body Parser
app.use(express.json());

// 4. Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join_post", (postId) => {
    socket.join(postId);
    console.log(`user joined post room: ${postId}`);
  });

  socket.on("leave_post", (postId) => {
    socket.leave(postId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// 5. Route Handlers 
app.use("/api/posts", require("./routes/posts"));
app.use("/api/users", require("./routes/users"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/ai", require("./routes/ai")); 

// Error Handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || err });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});