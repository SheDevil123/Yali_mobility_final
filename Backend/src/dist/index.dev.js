"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var cors = require('cors');

require('dotenv').config();

var path = require("path");

var app = express();
var port = 5000; // Middleware

app.use(bodyParser.json());
app.use(cors()); // ✅ Serve static files from "uploads" inside "src"

app.use("/uploads", express["static"](path.join(__dirname, "uploads"))); // Routes

var personaRoutes = require('./routes/personaRoutes'); // Import routes


app.use('/api', personaRoutes);

var exportRoutes = require("./routes/exportRoutes");

app.use("/api/export", exportRoutes);

var analyticsRoutes = require("./routes/analytics");

app.use("/api", analyticsRoutes);

var emailRoutes = require("./routes/emailRoutes");

app.use("/api/email", emailRoutes); // ✅ New OCR Route for Business Card Extraction

var ocrRoutes = require('./routes/ocrRoutes');

app.use('/api/ocr', ocrRoutes); // Register the profile routes with a base path

var profileRoutes = require("./routes/profile");

app.use("/api/profile", profileRoutes); // ✅ New Groups Route

var groupsRoutes = require('./routes/groupsRoutes'); // Import Groups Routes


app.use('/api/groups', groupsRoutes); // Start server

app.listen(port, function () {
  console.log("\u2705 Server is running on http://localhost:".concat(port));
});