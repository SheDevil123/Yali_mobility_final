const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { db } = require("../models/persona"); // Assuming you have a database connection

// ✅ Configure multer for profile photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/")); // Save in the "uploads" folder
  },
  filename: (req, file, cb) => {
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_"); // Remove special characters
    cb(null, `${Date.now()}-${safeFilename}`);
  },
});

const upload = multer({ storage });

// ✅ Route to fetch a persona by ID and type
router.get("/personas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // Fetch persona details, including profile_photo
    const persona = await db.oneOrNone("SELECT * FROM personas WHERE id = $1", [id]);

    if (!persona) {
      return res.status(404).json({ message: "Persona not found" });
    }

    res.status(200).json(persona);
  } catch (error) {
    console.error("Error fetching persona:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Route to fetch personas by type (e.g., Customers, Employees, Vendors)
router.get("/personas/type/:type", async (req, res) => {
  try {
    const { type } = req.params;

    // Fetch all personas of the given type, including profile_photo
    const personas = await db.manyOrNone("SELECT * FROM personas WHERE type = $1", [type]);

    if (!personas || personas.length === 0) {
      return res.status(404).json({ message: `No personas found for type: ${type}` });
    }

    res.status(200).json(personas);
  } catch (error) {
    console.error("Error fetching personas by type:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;