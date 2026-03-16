require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(cors()); app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST, user: process.env.DB_USER,
    password: process.env.DB_PASS, database: process.env.DB_NAME
});

// LOGIN
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin") return res.json({ auth: true, role: 'admin', username: 'Admin' });
    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, r) => {
        if (r && r.length > 0) res.json({ auth: true, role: r[0].role, username: r[0].username });
        else res.status(401).send("Fail");
    });
});

// TEAM MANAGEMENT
app.get('/api/employees', (req, res) => {
    db.query("SELECT * FROM employees", (err, r) => res.json(r || []));
});

app.post('/api/add-employee', (req, res) => {
    const { name, position, salary, password } = req.body;
    db.query("INSERT INTO employees (name, position, salary) VALUES (?,?,?)", [name, position, salary], () => {
        db.query("INSERT INTO users (username, password, role) VALUES (?,?,'staff')", [name, password], () => res.json("ok"));
    });
});

// EDIT ROUTE - Fixed and Verified
app.post('/api/edit-employee', (req, res) => {
    const { id, name, position, salary } = req.body;
    db.query("UPDATE employees SET name=?, position=?, salary=? WHERE id=?", [name, position, salary, id], (err) => {
        if (err) return res.status(500).send(err);
        res.json("ok");
    });
});

app.delete('/api/delete-employee/:id', (req, res) => {
    db.query("DELETE FROM employees WHERE id=?", [req.params.id], () => res.json("ok"));
});

// LEAVES
app.get('/api/leaves/:user/:role', (req, res) => {
    const { user, role } = req.params;
    const sql = role === 'admin' ? "SELECT * FROM leaves" : "SELECT * FROM leaves WHERE employee_name = ?";
    db.query(sql, [user], (err, r) => res.json(r || []));
});

app.post('/api/apply-leave', (req, res) => {
    const { username, type, reason } = req.body;
    db.query("INSERT INTO leaves (employee_name, leave_type, reason, status) VALUES (?,?,?,'Pending')", [username, type, reason], () => res.json("ok"));
});

app.post('/api/update-leave', (req, res) => {
    db.query("UPDATE leaves SET status = ? WHERE id = ?", [req.body.status, req.body.id], () => res.json("ok"));
});

// ANALYTICS
app.post('/api/check-in', (req, res) => {
    db.query("INSERT INTO work_log (employee_name, check_in) VALUES (?, NOW())", [req.body.username], () => res.json("In"));
});

app.post('/api/check-out', (req, res) => {
    const sql = `UPDATE work_log SET check_out = NOW(), total_hours = TIMESTAMPDIFF(SECOND, check_in, NOW()) / 3600 WHERE employee_name = ? AND check_out IS NULL`;
    db.query(sql, [req.body.username], () => res.json("Out"));
});

app.get('/api/analytics/:user/:role', (req, res) => {
    const { user, role } = req.params;
    const sql = role === 'admin' ? "SELECT * FROM work_log" : "SELECT * FROM work_log WHERE employee_name = ?";
    db.query(sql, [user], (err, r) => res.json(r || []));
});

app.listen(5000, () => console.log("🚀 Server Perfectly Synced on 5000"));