const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require("path");

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// ✅ Serve static files from "uploads" inside "src"
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const personaRoutes = require('./routes/personaRoutes'); // Import routes
app.use('/api', personaRoutes);

const exportRoutes = require("./routes/exportRoutes");
app.use("/api/export", exportRoutes);

const analyticsRoutes = require("./routes/analytics");
app.use("/api", analyticsRoutes);

const emailRoutes = require("./routes/emailRoutes");
app.use("/api/email", emailRoutes);

// ✅ New OCR Route for Business Card Extraction
const ocrRoutes = require('./routes/ocrRoutes');
app.use('/api/ocr', ocrRoutes);

// Register the profile routes with a base path
const profileRoutes = require("./routes/profile");
app.use("/api/profile", profileRoutes);

// ✅ New Groups Route
const groupsRoutes = require('./routes/groupsRoutes');  // Import Groups Routes
app.use('/api/groups', groupsRoutes);

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
