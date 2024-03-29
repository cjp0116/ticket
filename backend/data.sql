
drop database if exists ticket_system_test;
create database ticket_system_test;
\c ticket_system_test;

drop table if exists notes;
drop table if exists tickets;
drop table if exists users;
drop table if exists departments;

create table departments (
  deptCode TEXT PRIMARY KEY,
  deptName TEXT 
);

create table users (
  id serial primary key,
  email varchar(254) not null unique,
  username text not null unique,
  password text not null,
  firstName text not null,
  lastName text not null,
  deptCode text REFERENCES departments (deptCode) ON DELETE CASCADE,
  isAdmin BOOLEAN default false
);

create table tickets (
  id SERIAL PRIMARY KEY,
  createdBy TEXT REFERENCES users (username) ON DELETE CASCADE,
  assignedTo TEXT REFERENCES users (username) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  importanceLevel INT,
  closedAt TIMESTAMP,
  isResolved BOOLEAN NOT NULL DEFAULT false,
  subject varchar(200) NOT NULL,
  requestDetail TEXT NOT NULL,
  assignedGroup TEXT REFERENCES departments (deptCode) ON DELETE CASCADE
);

create table notes (
  id SERIAL PRIMARY KEY,
  ticketID INT REFERENCES tickets (id) ON DELETE CASCADE, 
  createdBy TEXT REFERENCES users (username) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  message TEXT
);

INSERT INTO departments (deptCode, deptName) 
VALUES ('F_END', 'front-end'), ('B_END', 'back-end'), ('F_STACK', 'full-stack'); 

INSERT INTO users (id, email, username, password, firstName, lastName, deptCode, isAdmin) 
VALUES (1, 'admin@admin.com', 'admin','$2b$10$XtKei/jcPtgqAQ1rHfLFKOLaY0JevTueMQFR.8pIsA3s.KNIsd3K2', 'Jae', 'Cho', 'F_STACK', true);

INSERT INTO tickets (createdBy, assignedTo, importanceLevel, isResolved, subject, requestDetail, assignedGroup)
VALUES ('admin', 'admin', 5, false, 'fix UI', 'fix the UI', 'F_STACK'), ('admin', 'admin', 5, false, 'fix DB', 'fix the DB', 'F_STACK');

-- COPY users (email, username, password, firstName, lastName, deptCode) 
-- FROM 'C:\Users\Jae Cho\Desktop\SpringBoard\capstone\capstone-2\generator\users.csv'
-- DELIMITER ',' 
-- CSV HEADER;

-- COPY tickets (createdBy, assignedTo, createdAt, importanceLevel, closedAt, isResolved, subject, requestDetail)
-- FROM 'C:\Users\Jae Cho\Desktop\Springboard\capstone\capstone-2\generator\tickets.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY notes (ticketID, createdBy, createdAt, message) 
-- FROM 'C:\Users\Jae Cho\Desktop\Springboard\capstone\capstone-2\generator\notes.csv'
-- DELIMITER ','
-- CSV HEADER;