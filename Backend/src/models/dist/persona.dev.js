"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require("dotenv").config();

var pgp = require("pg-promise")(); // Database configuration


var dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};
var db = pgp(dbConfig); // ✅ Helper function to handle empty values

var cleanValue = function cleanValue(value) {
  if (value === undefined || value === "" || value === "null" || value === "undefined") return null;
  return value;
};

var createPersona = function createPersona(persona) {
  var existingPersona, personaResult, employeeQuery, vendorQuery, customerQuery;
  return regeneratorRuntime.async(function createPersona$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("🔍 Checking if email already exists:", persona.email); // ✅ Check if email already exists

          _context.next = 4;
          return regeneratorRuntime.awrap(db.oneOrNone("SELECT * FROM personas WHERE email = $1", [persona.email]));

        case 4:
          existingPersona = _context.sent;

          if (!existingPersona) {
            _context.next = 8;
            break;
          }

          console.log("❌ Persona already exists:", existingPersona);
          throw new Error("Persona with email ".concat(persona.email, " already exists."));

        case 8:
          console.log("✅ No existing persona found. Proceeding with insertion."); // ✅ Insert into `personas` table

          _context.next = 11;
          return regeneratorRuntime.awrap(db.one("INSERT INTO personas (name, email, phone, state, pin_code, message, type, is_favorite, profile_photo, created_at, updated_at) \n       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING *", [persona.name, persona.email, persona.phone, cleanValue(persona.state), cleanValue(persona.pinCode), cleanValue(persona.message), persona.type, Boolean(persona.isFavorite), persona.profile_photo || "" // Store only the filename
          ]));

        case 11:
          personaResult = _context.sent;
          console.log("\u2705 Persona inserted with ID: ".concat(personaResult.id)); // ✅ Skip additional table inserts for "Others"

          if (!(persona.type === "Others")) {
            _context.next = 16;
            break;
          }

          console.log("ℹ️ No additional details to insert for type 'Others'.");
          return _context.abrupt("return", personaResult);

        case 16:
          if (!(persona.type === "Employees")) {
            _context.next = 23;
            break;
          }

          employeeQuery = "\n        INSERT INTO employees (persona_id, date_of_birth, father_name, blood_group, emergency_contact, aadhar_number, \n          joining_date, probation_end_date, previous_employer) \n        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
          _context.next = 20;
          return regeneratorRuntime.awrap(db.one(employeeQuery, [personaResult.id, cleanValue(persona.dateOfBirth), cleanValue(persona.fatherName), cleanValue(persona.bloodGroup), cleanValue(persona.emergencyContact), cleanValue(persona.aadharNumber), cleanValue(persona.joiningDate), cleanValue(persona.probationEndDate), cleanValue(persona.previousEmployer)]));

        case 20:
          console.log("✅ Employee details inserted.");
          _context.next = 35;
          break;

        case 23:
          if (!(persona.type === "Vendors")) {
            _context.next = 30;
            break;
          }

          vendorQuery = "\n        INSERT INTO vendors (persona_id, address, pan_number, gst_number, bank_name, account_number, ifsc_code) \n        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
          _context.next = 27;
          return regeneratorRuntime.awrap(db.one(vendorQuery, [personaResult.id, cleanValue(persona.address), cleanValue(persona.panNumber), cleanValue(persona.gstNumber), cleanValue(persona.bankName), cleanValue(persona.accountNumber), cleanValue(persona.ifscCode)]));

        case 27:
          console.log("✅ Vendor details inserted.");
          _context.next = 35;
          break;

        case 30:
          if (!(persona.type === "Customers")) {
            _context.next = 35;
            break;
          }

          customerQuery = "\n        INSERT INTO customers (persona_id, age, location, job, income_range, family_members, weight, speed, user_type, \n          wheelchair_type, commute_range, commute_mode, pains_daily, pains_commute, solutions_needed, \n          customer_segment, expected_gain) \n        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *";
          _context.next = 34;
          return regeneratorRuntime.awrap(db.one(customerQuery, [personaResult.id, cleanValue(persona.age), cleanValue(persona.location), cleanValue(persona.job), cleanValue(persona.income), cleanValue(persona.familyMembers), cleanValue(persona.weight), cleanValue(persona.speed), cleanValue(persona.userType), cleanValue(persona.wheelchairType), cleanValue(persona.commuteRange), cleanValue(persona.commuteMode), cleanValue(persona.painsDaily), cleanValue(persona.painsCommute), cleanValue(persona.solutionsNeeded), cleanValue(persona.customerSegment), cleanValue(persona.expectedGain)]));

        case 34:
          console.log("✅ Customer details inserted.");

        case 35:
          return _context.abrupt("return", personaResult);

        case 38:
          _context.prev = 38;
          _context.t0 = _context["catch"](0);
          console.error("❌ Error creating persona:", _context.t0);
          throw _context.t0;

        case 42:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 38]]);
}; // ✅ Get Personas by Type


var getPersonasByType = function getPersonasByType(type) {
  var personas, formattedPersonas;
  return regeneratorRuntime.async(function getPersonasByType$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log("\uD83D\uDD0D Fetching personas of type: ".concat(type || "All"));

          if (!type) {
            _context2.next = 8;
            break;
          }

          _context2.next = 5;
          return regeneratorRuntime.awrap(db.any("SELECT * FROM personas WHERE type = $1", [type]));

        case 5:
          _context2.t0 = _context2.sent;
          _context2.next = 11;
          break;

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(db.any("SELECT * FROM personas"));

        case 10:
          _context2.t0 = _context2.sent;

        case 11:
          personas = _context2.t0;
          // ✅ Format response to return full image URL
          formattedPersonas = personas.map(function (persona) {
            return _objectSpread({}, persona, {
              profile_photo: persona.profile_photo ? "".concat(process.env.BACKEND_URL || "http://localhost:5000", "/uploads/").concat(persona.profile_photo) : null
            });
          });
          return _context2.abrupt("return", formattedPersonas);

        case 16:
          _context2.prev = 16;
          _context2.t1 = _context2["catch"](0);
          console.error("❌ Database error fetching personas:", _context2.t1);
          throw _context2.t1;

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
}; // ✅ Toggle Favorite Status


var toggleFavorite = function toggleFavorite(id, isFavorite) {
  var result;
  return regeneratorRuntime.async(function toggleFavorite$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log("\uD83D\uDD04 Updating favorite status: Persona ID = ".concat(id, ", New Value = ").concat(isFavorite));

          if (!(typeof isFavorite !== "boolean")) {
            _context3.next = 4;
            break;
          }

          throw new Error("Invalid is_favorite value. Must be true or false.");

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(db.oneOrNone("UPDATE personas SET is_favorite = $1, updated_at = NOW() WHERE id = $2 RETURNING *", [isFavorite, id]));

        case 6:
          result = _context3.sent;

          if (result) {
            _context3.next = 10;
            break;
          }

          console.error("\u274C Persona with ID ".concat(id, " not found."));
          return _context3.abrupt("return", null);

        case 10:
          console.log("\u2705 Favorite status updated for Persona ID: ".concat(id));
          return _context3.abrupt("return", result);

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](0);
          console.error("❌ Database error toggling favorite:", _context3.t0);
          throw _context3.t0;

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 14]]);
}; // ✅ Export All Functions


module.exports = {
  db: db,
  createPersona: createPersona,
  getPersonasByType: getPersonasByType,
  toggleFavorite: toggleFavorite
};