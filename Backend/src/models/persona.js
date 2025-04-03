require("dotenv").config();
const pgp = require("pg-promise")();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};
const db = pgp(dbConfig);

// ✅ Helper function to handle empty values
const cleanValue = (value) => {
  if (value === undefined || value === "" || value === "null" || value === "undefined") return null;
  return value;
};

const createPersona = async (persona) => {
  try {
    console.log("🔍 Checking if email already exists:", persona.email);

    // ✅ Check if email already exists
    const existingPersona = await db.oneOrNone("SELECT * FROM personas WHERE email = $1", [persona.email]);

    if (existingPersona) {
      console.log("❌ Persona already exists:", existingPersona);
      throw new Error(`Persona with email ${persona.email} already exists.`);
    }

    console.log("✅ No existing persona found. Proceeding with insertion.");

    // ✅ Insert into `personas` table
    const personaResult = await db.one(
      `INSERT INTO personas (name, email, phone, state, pin_code, message, type, is_favorite, profile_photo, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING *`,
      [
        persona.name,
        persona.email,
        persona.phone,
        cleanValue(persona.state),
        cleanValue(persona.pinCode),
        cleanValue(persona.message),
        persona.type,
        Boolean(persona.isFavorite),
        persona.profile_photo || "", // Store only the filename
      ]
    );

    console.log(`✅ Persona inserted with ID: ${personaResult.id}`);

    // ✅ Skip additional table inserts for "Others"
    if (persona.type === "Others") {
      console.log("ℹ️ No additional details to insert for type 'Others'.");
      return personaResult;
    }

    // ✅ Insert into Respective Table Based on Type
    if (persona.type === "Employees") {
      const employeeQuery = `
        INSERT INTO employees (persona_id, date_of_birth, father_name, blood_group, emergency_contact, aadhar_number, 
          joining_date, probation_end_date, previous_employer) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;

      await db.one(employeeQuery, [
        personaResult.id,
        cleanValue(persona.dateOfBirth),
        cleanValue(persona.fatherName),
        cleanValue(persona.bloodGroup),
        cleanValue(persona.emergencyContact),
        cleanValue(persona.aadharNumber),
        cleanValue(persona.joiningDate),
        cleanValue(persona.probationEndDate),
        cleanValue(persona.previousEmployer),
      ]);
      console.log("✅ Employee details inserted.");
    } else if (persona.type === "Vendors") {
      const vendorQuery = `
        INSERT INTO vendors (persona_id, address, pan_number, gst_number, bank_name, account_number, ifsc_code) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

      await db.one(vendorQuery, [
        personaResult.id,
        cleanValue(persona.address),
        cleanValue(persona.panNumber),
        cleanValue(persona.gstNumber),
        cleanValue(persona.bankName),
        cleanValue(persona.accountNumber),
        cleanValue(persona.ifscCode),
      ]);
      console.log("✅ Vendor details inserted.");
    } else if (persona.type === "Customers") {
      const customerQuery = `
        INSERT INTO customers (persona_id, age, location, job, income_range, family_members, weight, speed, user_type, 
          wheelchair_type, commute_range, commute_mode, pains_daily, pains_commute, solutions_needed, 
          customer_segment, expected_gain) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`;

      await db.one(customerQuery, [
        personaResult.id,
        cleanValue(persona.age),
        cleanValue(persona.location),
        cleanValue(persona.job),
        cleanValue(persona.income),
        cleanValue(persona.familyMembers),
        cleanValue(persona.weight),
        cleanValue(persona.speed),
        cleanValue(persona.userType),
        cleanValue(persona.wheelchairType),
        cleanValue(persona.commuteRange),
        cleanValue(persona.commuteMode),
        cleanValue(persona.painsDaily),
        cleanValue(persona.painsCommute),
        cleanValue(persona.solutionsNeeded),
        cleanValue(persona.customerSegment),
        cleanValue(persona.expectedGain),
      ]);
      console.log("✅ Customer details inserted.");
    }

    return personaResult;
  } catch (error) {
    console.error("❌ Error creating persona:", error);
    throw error;
  }
};

// ✅ Get Personas by Type
const getPersonasByType = async (type) => {
  try {
    console.log(`🔍 Fetching personas of type: ${type || "All"}`);

    const personas = type
      ? await db.any("SELECT * FROM personas WHERE type = $1", [type])
      : await db.any("SELECT * FROM personas");

    // ✅ Format response to return full image URL
    const formattedPersonas = personas.map((persona) => ({
      ...persona,
      profile_photo: persona.profile_photo
        ? `${process.env.BACKEND_URL || "http://localhost:5000"}/uploads/${persona.profile_photo}`
        : null,
    }));

    return formattedPersonas;
  } catch (error) {
    console.error("❌ Database error fetching personas:", error);
    throw error;
  }
};

// ✅ Toggle Favorite Status
const toggleFavorite = async (id, isFavorite) => {
  try {
    console.log(`🔄 Updating favorite status: Persona ID = ${id}, New Value = ${isFavorite}`);

    if (typeof isFavorite !== "boolean") {
      throw new Error("Invalid is_favorite value. Must be true or false.");
    }

    const result = await db.oneOrNone(
      "UPDATE personas SET is_favorite = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [isFavorite, id]
    );

    if (!result) {
      console.error(`❌ Persona with ID ${id} not found.`);
      return null;
    }

    console.log(`✅ Favorite status updated for Persona ID: ${id}`);
    return result;
  } catch (error) {
    console.error("❌ Database error toggling favorite:", error);
    throw error;
  }
};

// ✅ Export All Functions
module.exports = { db, createPersona, getPersonasByType, toggleFavorite };
