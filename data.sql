CREATE DATABASE IF NOT EXISTS 'ticket';
\c ticket;

DROP TABLE users;
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email EMAIL NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  deptCode TEXT
);

DROP TABLE ticket
CREATE TABLE ticket (
  id SERIAL PRIMARY KEY,
  createdBy TEXT REFERENCES users (username) ON DELETE SET NULL,
  assignedTo TEXT REFERENCES users (username) ON DELETE SET NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  importanceLevel INT,
  closedAt DATETIME,
  isResolved BOOLEAN NOT NULL,
);

DROP TABLE notes
CREATE TABLE notes (
  ticketID INT REFERENCES ticket (id), 
  createdBy TEXT REFERENCES users (username),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  message TEXT,
);



