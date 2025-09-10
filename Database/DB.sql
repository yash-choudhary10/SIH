CREATE DATABASE sih CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sih;



-- Departments
CREATE TABLE departments (
  dept_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Users
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(150),
  role ENUM('citizen','staff','admin') NOT NULL DEFAULT 'citizen',
  department_id INT NULL,
  password_hash VARCHAR(255) NULL,        -- for future auth
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(dept_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Issues
CREATE TABLE issues (
  issue_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  dept_id INT NULL,
  category VARCHAR(80),
  description TEXT,
  latitude DECIMAL(9,6) NULL,
  longitude DECIMAL(9,6) NULL,
  address VARCHAR(255) NULL,
  image_url VARCHAR(512) NULL,           -- S3 URL
  status ENUM('Submitted','Acknowledged','In Progress','Resolved') DEFAULT 'Submitted',
  priority ENUM('Normal','Urgent') DEFAULT 'Normal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Notifications
CREATE TABLE notifications (
  notif_id INT AUTO_INCREMENT PRIMARY KEY,
  issue_id INT,
  user_id INT,
  message TEXT,
  channel ENUM('portal','sms','push') DEFAULT 'portal',
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (issue_id) REFERENCES issues(issue_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Audit logs (optional)
CREATE TABLE audit_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  issue_id INT,
  actor_user_id INT,
  action VARCHAR(100),
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (issue_id) REFERENCES issues(issue_id) ON DELETE CASCADE
) ENGINE=InnoDB;



CREATE INDEX idx_issues_dept_status ON issues(dept_id, status);
CREATE INDEX idx_issues_created_at ON issues(created_at);
CREATE INDEX idx_issues_location ON issues(latitude, longitude);
CREATE INDEX idx_users_role ON users(role);



INSERT INTO departments (name) VALUES ('Sanitation'), ('Roads'), ('Electricity');

INSERT INTO users (name, phone, email, role, department_id)
VALUES ('Ramesh Kumar','9876543210','ramesh@example.com','citizen', NULL),
       ('Anita Sharma','9123456780','anita@municipal.gov','staff', 1),
       ('Admin User','9000000000','admin@municipal.gov','admin', NULL);

INSERT INTO issues (user_id, dept_id, category, description, latitude, longitude, address, image_url)
VALUES (1, 1, 'Garbage', 'Overflowing trash bin near park', 28.613939, 77.209021, 'Near Park, Sector 12', 'https://s3.amazonaws.com/civicfix/issues/trash001.jpg');



SELECT i.issue_id, i.category, i.status, u.name AS reported_by, d.name AS dept
FROM issues i
LEFT JOIN users u ON i.user_id = u.user_id
LEFT JOIN departments d ON i.dept_id = d.dept_id;





