const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { createPersona, getPersonasByType, toggleFavorite } = require("../models/persona");


// ✅ Configure multer for profile photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_"); // ✅ Remove special characters
    cb(null, `${Date.now()}-${safeFilename}`);
  },
});

const upload = multer({ storage });

// ✅ Create a new persona (with optional profile photo)
router.post("/personas", upload.single("profilePhoto"), async (req, res) => {
  try {
    console.log("📥 Received form data:", req.body);
    console.log("📸 Uploaded file:", req.file);

    const { name, email, phone, state, pinCode, message, type, isFavorite, ...additionalDetails } = req.body;
const profilePhoto = req.file ? req.file.filename : "";

const newPersona = await createPersona({
  name,
  email,
  phone,
  state,
  pinCode,
  message,
  type,
  isFavorite: isFavorite === "true",
  profile_photo: profilePhoto, 
  ...additionalDetails, // ✅ Pass additional fields for Employees, Vendors, and Customers
});

    res.status(201).json({ message: "Persona added successfully", data: newPersona });
  } catch (error) {
    console.error("❌ Error creating persona:", error);
    res.status(500).json({ error: "Failed to create persona", details: error.message });
  }
});

// ✅ Get personas (filtered by type if provided)
router.get("/personas", async (req, res) => {
  try {
    const type = req.query.type || null;
    const personas = await getPersonasByType(type);
    res.status(200).json(personas);
  } catch (error) {
    console.error("❌ Error fetching personas:", error);
    res.status(500).json({ message: "Error fetching personas", error: error.message });
  }
});

// ✅ Toggle favorite status
router.patch("/personas/:id/favorite", async (req, res) => {
  try {
    const { id } = req.params;
    let { is_favorite } = req.body;

    console.log(`📥 Received request: Toggle favorite for ID: ${id}, Value: ${is_favorite}`);

    if (typeof is_favorite !== "boolean") {
      console.error("❌ Invalid is_favorite value received:", is_favorite);
      return res.status(400).json({ message: "Invalid is_favorite value. Must be true or false." });
    }

    const updatedPersona = await toggleFavorite(id, is_favorite);

    if (!updatedPersona) {
      return res.status(404).json({ message: "❌ Persona not found" });
    }

    console.log(`✅ Favorite status updated for ID: ${id}`);
    res.status(200).json({ message: "Favorite status updated", data: updatedPersona });
  } catch (error) {
    console.error("❌ Error updating favorite status:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
