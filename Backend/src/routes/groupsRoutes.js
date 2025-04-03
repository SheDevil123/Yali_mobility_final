const express = require("express");
const router = express.Router();
const pool = require("../db"); // Import PostgreSQL connection

// ✅ Get all groups
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM groups");
    console.log("Fetched Groups:", result.rows); // ✅ Debugging log
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Create a new group
router.post("/", async (req, res) => {
  const { group_name, description, members } = req.body;

  if (!group_name) {
    return res.status(400).json({ message: "Group name is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO groups (group_name, description, members) VALUES ($1, $2, $3) RETURNING *",
      [group_name, description || "", members || []] // Default values if undefined
    );

    console.log("Group Created:", result.rows[0]); // ✅ Debug log
    res.status(201).json({ message: "Group created", group: result.rows[0] });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Update an existing group
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { group_name, description, members } = req.body;

  try {
    const result = await pool.query(
      "UPDATE groups SET group_name = $1, description = $2, members = $3 WHERE id = $4 RETURNING *",
      [group_name, description, members, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    console.log("Group Updated:", result.rows[0]); // ✅ Debug log
    res.json({ message: "Group updated successfully", group: result.rows[0] });
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Delete a group
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM groups WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    console.log("Group Deleted:", id); // ✅ Debug log
    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
