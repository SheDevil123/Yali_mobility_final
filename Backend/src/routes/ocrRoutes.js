const express = require('express'); 
const multer = require('multer');
const Tesseract = require('tesseract.js');
const { spawnSync } = require('child_process');
const pool = require('../db'); // Import your database connection

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Function to extract text from image using Tesseract OCR
async function extractText(imagePath) {
    try {
        const { data: { text } } = await Tesseract.recognize(imagePath, "eng");
        return text.trim();
    } catch (error) {
        console.error("OCR Error:", error);
        return "";
    }
}

// Function to refine OCR text using Llama 3.2
function refineWithLlama(text) {
    const prompt = `
    Extract and correct details from the following text (from a business card).
    Format the output as a valid JSON with fields: Name, Company, Role, Email, Phone, Website, Address.
    Give only JSON as output, no extra words or conclusion.

    Text:
    ${text}
    `;

    try {
        const response = spawnSync("ollama", ["run", "llama3.2"], {
            input: prompt,
            encoding: "utf-8",
            shell: true
        });

        return response.stdout.trim();
    } catch (error) {
        console.error("Llama Error:", error);
        return "{}";  // Return empty JSON in case of an error
    }
}

// POST route to process business card image
router.post('/process-card', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        console.log("Processing Image:", req.file.path);
        
        // Step 1: Extract text from image
        const rawText = await extractText(req.file.path);
        console.log("Extracted Text:", rawText);
        
        // Step 2: Process extracted text using Llama 3.2
        const refinedData = refineWithLlama(rawText);
        console.log('Refined data from Llama:', refinedData);

        let parsedData = {};
        try {
            parsedData = JSON.parse(refinedData);
        } catch (error) {
            console.error("Error parsing Llama response:", error);
            parsedData = {};  // Fallback to empty object in case of error
        }

        // Step 3: Save extracted data into the database
        const { Name, Company, Role, Email, Phone, Website, Address } = parsedData;

        const messageContent = `Company: ${Company || "N/A"}, Role: ${Role || "N/A"}, Website: ${Website || "N/A"}, Address: ${Address || "N/A"}`;

        const query = `
            INSERT INTO personas (name, email, phone, message, type)
            VALUES ($1, $2, $3, $4, 'Others')
            RETURNING *;
        `;

        const values = [Name || "Unknown", Email || "", Phone || "", messageContent];

        const result = await pool.query(query, values);

        res.status(201).json({ message: 'Persona added successfully', data: result.rows[0] });

    } catch (error) {
        console.error("Error processing business card:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
