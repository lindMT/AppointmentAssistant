const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/user");
const appointmentRoutes = require("./routes/appointment");

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/user", userRoutes);
app.use("/appointment", appointmentRoutes);

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
