const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔗 Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // <-- change to your MySQL username
  password: "yash@SQL1793", // <-- change to your MySQL password
  database: "sih"     // <-- matches your DB.sql file
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL connected...");
});

// =====================
// Citizen APIs
// =====================

// Citizen submits complaint
app.post("/complaints", (req, res) => {
  const { user_id, name, phone, category, description, location, audio } = req.body;

  const sql = `
    INSERT INTO issues (user_id, category, description, address, status) 
    VALUES (?, ?, ?, ?, 'Submitted')
  `;
  db.query(sql, [user_id || null, category, description, location], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error saving complaint" });
    }
    res.json({ message: "Complaint submitted successfully!", issueId: result.insertId });
  });
});

// =====================
// Staff APIs
// =====================

// Get all complaints
app.get("/complaints", (req, res) => {
  const sql = `
    SELECT i.issue_id AS id, i.category, i.description, i.status, 
           i.address, i.latitude, i.longitude, d.name AS department
    FROM issues i
    LEFT JOIN departments d ON i.dept_id = d.dept_id
    ORDER BY i.created_at DESC
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching complaints" });
    }
    res.json(result);
  });
});

// Update complaint status
app.put("/complaints/:id/status", (req, res) => {
  const { status } = req.body;
  const sql = "UPDATE issues SET status = ? WHERE issue_id = ?";
  db.query(sql, [status, req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating status" });
    }
    res.json({ message: "Status updated successfully!" });
  });
});

// =====================
// Start server
// =====================
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
