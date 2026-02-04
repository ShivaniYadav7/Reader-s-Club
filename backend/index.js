require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();

// Load allowed origins from environment variable and split into an array
const allowedOriginsEnv = process.env.CORS_ALLOWED_ORIGINS || "";
const allowedOrigins = allowedOriginsEnv.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin like Postman or curl
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin: " +
          origin;
        console.error(msg);
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// Route handlers
app.use("/api/posts", require("./routes/posts"));
app.use("/api/users", require("./routes/users"));
app.use("/api/groups", require("./routes/groups"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || err });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
