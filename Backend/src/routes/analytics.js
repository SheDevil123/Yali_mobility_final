const express = require("express");
const router = express.Router();
const { db } = require("../models/persona"); // Import the db object from persona.js

// Helper function to calculate engagement rate
const calculateEngagementRate = async () => {
  try {
    const totalInteractions = await db.one("SELECT COUNT(*) AS count FROM interactions");
    const totalPersonas = await db.one("SELECT COUNT(*) AS count FROM personas");

    if (totalPersonas.count === 0) return 0; // Avoid division by zero
    return ((totalInteractions.count / totalPersonas.count) * 100).toFixed(2);
  } catch (error) {
    console.error("Error calculating engagement rate:", error);
    return 0;
  }
};

// Analytics route
router.get("/analytics", async (req, res) => {
  try {
    // Total personas
    const totalPersonas = await db.one("SELECT COUNT(*) AS count FROM personas");

    // Active employees
    const activeEmployees = await db.one("SELECT COUNT(*) AS count FROM employees");

    // Type distribution
    const typeDistribution = [
      {
        type: "Employees",
        count: (await db.one("SELECT COUNT(*) AS count FROM employees")).count,
      },
      {
        type: "Customers",
        count: (await db.one("SELECT COUNT(*) AS count FROM customers")).count,
      },
      {
        type: "Vendors",
        count: (await db.one("SELECT COUNT(*) AS count FROM vendors")).count,
      },
    ];

    // Monthly data for persona growth
    const monthlyData = await db.any(`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') AS month,
        COUNT(*) AS total,
        SUM(CASE WHEN type = 'Employees' THEN 1 ELSE 0 END) AS employees,
        SUM(CASE WHEN type = 'Vendors' THEN 1 ELSE 0 END) AS vendors,
        SUM(CASE WHEN type = 'Customers' THEN 1 ELSE 0 END) AS customers
      FROM personas
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at);
    `);

    // Weekly activity data (using personas table)
    let activityData = [];
    try {
      activityData = await db.any(`
        SELECT 
          TO_CHAR(DATE_TRUNC('week', created_at), 'WW') AS week,
          COUNT(*) AS total_personas
        FROM personas
        GROUP BY DATE_TRUNC('week', created_at)
        ORDER BY DATE_TRUNC('week', created_at);
      `);
    } catch (error) {
      console.warn("Error fetching activity data:", error);
    }

    // Engagement rate
    const engagementRate = await calculateEngagementRate();

    // Format response
    res.json({
      totalPersonas: totalPersonas.count,
      activeEmployees: activeEmployees.count,
      engagementRate: `${engagementRate}%`,
      typeDistribution: typeDistribution.map((type) => ({
        name: type.type,
        value: parseInt(type.count, 10),
        color: type.type === "Employees" ? "#3b82f6" : type.type === "Customers" ? "#22c55e" : "#a855f7",
      })),
      monthlyData,
      activityData: activityData.map((item) => ({
        name: `Week ${item.week}`,
        interactions: parseInt(item.total_personas, 10),
      })),
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;