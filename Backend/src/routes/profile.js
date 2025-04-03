const express = require("express");
const router = express.Router();
const { db } = require("../models/persona");

// Customer, Employee, and Vendor Profiles
router.get("/personas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // Fetch basic persona details
    const persona = await db.oneOrNone("SELECT * FROM personas WHERE id = $1", [id]);

    if (!persona) {
      return res.status(404).json({ message: "Persona not found" });
    }

    // Fetch additional details based on persona type
    if (persona.type === "Customers") {
      console.log("Fetching additional details for customer with persona_id:", id); // Debugging
      const additionalDetails = await db.oneOrNone(
        "SELECT * FROM customers WHERE persona_id = $1",
        [id]
      );
      if (!additionalDetails) {
        console.log("No additional details found for persona_id:", id); // Debugging
      } else {
        console.log("Additional Details Fetched:", additionalDetails); // Debugging
      }
      persona.additionalDetails = additionalDetails || {}; // Ensure it's not null
    } else if (persona.type === "Employees") {
      console.log("Fetching additional details for employee with persona_id:", id); // Debugging
      const additionalDetails = await db.oneOrNone(
        "SELECT * FROM employees WHERE persona_id = $1",
        [id]
      );
      if (!additionalDetails) {
        console.log("No additional details found for persona_id:", id); // Debugging
      } else {
        console.log("Additional Details Fetched:", additionalDetails); // Debugging
      }
      persona.additionalDetails = additionalDetails || {}; // Ensure it's not null
    } else if (persona.type === "Vendors") {
      console.log("Fetching additional details for vendor with persona_id:", id); // Debugging
      const additionalDetails = await db.oneOrNone(
        "SELECT * FROM vendors WHERE persona_id = $1",
        [id]
      );
      if (!additionalDetails) {
        console.log("No additional details found for persona_id:", id); // Debugging
      } else {
        console.log("Additional Details Fetched:", additionalDetails); // Debugging
      }
      persona.additionalDetails = additionalDetails || {}; // Ensure it's not null
    } else {
      console.log("Unknown persona type:", persona.type); // Debugging
      persona.additionalDetails = {}; // Default to an empty object for unknown types
    }

    res.status(200).json(persona);
  } catch (error) {
    console.error("Error fetching persona:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Export the router
module.exports = router;