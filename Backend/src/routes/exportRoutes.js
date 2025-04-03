const express = require("express");
const fs = require("fs");
const { Parser } = require("json2csv");
const pool = require("../db");

const router = express.Router();

const generateCSV = async (query, filename) => {
  const client = await pool.connect();
  try {
    const result = await client.query(query);
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(result.rows);
    fs.writeFileSync(filename, csv);
    return filename;
  } catch (err) {
    console.error("Error generating CSV:", err);
    throw err;
  } finally {
    client.release();
  }
};

router.get("/download/:type", async (req, res) => {
  const type = req.params.type;
  let query = "";
  let filename = `${type}.csv`;

  switch (type) {
    case "all_personas":
      query = "SELECT * FROM personas";
      break;
    case "employees":
      query = `SELECT personas.*, employees.* FROM employees 
               JOIN personas ON employees.persona_id = personas.id`;
      break;
    case "vendors":
      query = `SELECT personas.*, vendors.* FROM vendors 
               JOIN personas ON vendors.persona_id = personas.id`;
      break;
    case "customers":
      query = `SELECT personas.*, customers.* FROM customers 
               JOIN personas ON customers.persona_id = personas.id`;
      break;
    default:
      return res.status(400).send("Invalid type");
  }

  try {
    await generateCSV(query, filename);
    res.download(filename, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).send("Error downloading file");
      }
      fs.unlinkSync(filename);
    });
  } catch (error) {
    res.status(500).send("Error generating file");
  }
});

module.exports = router;
