"use strict";

var express = require("express");

var router = express.Router();

var pool = require("../db"); // Import PostgreSQL connection
// ✅ Get all groups


router.get("/", function _callee(req, res) {
  var result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(pool.query("SELECT * FROM groups"));

        case 3:
          result = _context.sent;
          console.log("Fetched Groups:", result.rows); // ✅ Debugging log

          res.json(result.rows);
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching groups:", _context.t0);
          res.status(500).json({
            message: "Internal server error"
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); // ✅ Create a new group

router.post("/", function _callee2(req, res) {
  var _req$body, group_name, description, members, result;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, group_name = _req$body.group_name, description = _req$body.description, members = _req$body.members;

          if (group_name) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Group name is required"
          }));

        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(pool.query("INSERT INTO groups (group_name, description, members) VALUES ($1, $2, $3) RETURNING *", [group_name, description || "", members || []] // Default values if undefined
          ));

        case 6:
          result = _context2.sent;
          console.log("Group Created:", result.rows[0]); // ✅ Debug log

          res.status(201).json({
            message: "Group created",
            group: result.rows[0]
          });
          _context2.next = 15;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](3);
          console.error("Error creating group:", _context2.t0);
          res.status(500).json({
            message: "Internal server error"
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 11]]);
}); // ✅ Update an existing group

router.put("/:id", function _callee3(req, res) {
  var id, _req$body2, group_name, description, members, result;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          _req$body2 = req.body, group_name = _req$body2.group_name, description = _req$body2.description, members = _req$body2.members;
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(pool.query("UPDATE groups SET group_name = $1, description = $2, members = $3 WHERE id = $4 RETURNING *", [group_name, description, members, id]));

        case 5:
          result = _context3.sent;

          if (!(result.rowCount === 0)) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Group not found"
          }));

        case 8:
          console.log("Group Updated:", result.rows[0]); // ✅ Debug log

          res.json({
            message: "Group updated successfully",
            group: result.rows[0]
          });
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](2);
          console.error("Error updating group:", _context3.t0);
          res.status(500).json({
            message: "Internal server error"
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 12]]);
}); // ✅ Delete a group

router["delete"]("/:id", function _callee4(req, res) {
  var id, result;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(pool.query("DELETE FROM groups WHERE id = $1", [id]));

        case 4:
          result = _context4.sent;

          if (!(result.rowCount === 0)) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Group not found"
          }));

        case 7:
          console.log("Group Deleted:", id); // ✅ Debug log

          res.json({
            message: "Group deleted successfully"
          });
          _context4.next = 15;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](1);
          console.error("Error deleting group:", _context4.t0);
          res.status(500).json({
            message: "Internal server error"
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 11]]);
});
module.exports = router;