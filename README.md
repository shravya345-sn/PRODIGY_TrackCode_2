# EMS CORE - Enterprise Employee Management System

EMS CORE is a full-stack lifecycle management application designed for modern workplaces. It streamlines HR operations by providing a centralized platform for employee administration, automated work-hour analytics, and digital leave management.

## 🚀 Project Overview
The system is built on a Three-Tier Architecture (Client-Server-Database). It separates administrative controls from staff interfaces to ensure data security and operational efficiency.

Key Functional Pillars:
Dashboard: A professional greeting interface with real-time "Check-In/Out" for attendance.

Leave Management: A digital bridge between staff and admins for requesting and approving leaves.

Work Analytics: Precise tracking of productivity hours using SQL-side time-stamping.

Manage Team: A secure portal for Admins to perform CRUD (Create, Read, Update, Delete) operations on staff profiles.

## 🚀 Key Features by Role
### 👨‍💼 Admin Portal (Management)
Total Oversight: Access to the "Manage Team" section to Add, Edit, or Delete staff members.

Leave Authority: View a centralized grid of all pending leave requests with the power to Approve or Reject.

Performance Analytics: View precise work-hour logs for every employee in the organization.

Secure Routing: Administrative views are protected; they are inaccessible to standard staff accounts.

### 👩‍💻 Staff Portal (User)
Interactive Dashboard: Personalized welcome screen with integrated Check-In/Out functionality.

Time Tracking: View personal work logs and total hours calculated down to the second.

Digital Leave Requests: Submit Sick or Casual leave applications with custom reasons directly to the Admin.

Profile Integrity: Staff accounts are read-only for personal details, ensuring data consistency.

## 🛠️ Tech Stack
Frontend: React.js (State Management, Axios, CSS3 Flexbox)

Backend: Node.js, Express.js (RESTful API Design)

Database: MySQL (Relational Data Persistence)

Design Architecture: Decoupled Client-Server model

## Frontend dependencies

node_modules/   # (Ignored in Git)

README.md           # Documentation


## ⚙️ How to Run This Project
### 1. Database Setup (MySQL)
Open your MySQL Workbench or Terminal and execute the following script:

SQL

CREATE DATABASE ems_db;
USE ems_db;

-- Table for Authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    role ENUM('admin', 'staff') DEFAULT 'staff'
);

-- Table for Employee Details
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    position VARCHAR(100),
    salary DECIMAL(10,2)
);

-- Table for Attendance & Analytics
CREATE TABLE work_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_name VARCHAR(100),
    check_in DATETIME,
    check_out DATETIME,
    total_hours DECIMAL(10,4) DEFAULT 0.0000
);

-- Table for Leave Requests
CREATE TABLE leaves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_name VARCHAR(100),
    leave_type VARCHAR(50),
    reason TEXT,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Initial Admin Login
INSERT INTO users (username, password, role) VALUES ('admin', 'admin', 'admin');
2. Backend Setup
Navigate to the backend folder.

Install dependencies: npm install

### 2. 🔑 Security Step: Setup Environment Variables
Create a file named `.env` in the backend folder and add the following:

DB_HOST=localhost

DB_USER=root

DB_PASS=YOUR_MYSQL_PASSWORD_HERE

DB_NAME=ems_db

### 3. Frontend Setup
Navigate to the frontend folder.

Install dependencies: npm install

Start the app: npm start

## 🔐 Credentials for Demo
Role: Admin | Username: admin | Password: admin

Role: Staff | Create a staff user via the Admin panel first, then log in.

## 📂 Project Structure

```text
EMS_PROJECT/
├── backend/                # Node.js + Express API
│   ├── server.js           # Main server logic & DB connection
│   ├── .env                # Private environment variables (Ignored)
│   └── package.json        # Backend dependencies
├── frontend/               # React.js Application
│   ├── src/
│   │   ├── App.js          # Main UI and State logic
│   │   └── index.js        # React entry point
│   └── package.json        # Frontend dependencies
├── README.md               # Documentation
└── .gitignore              # Files to exclude from Git


