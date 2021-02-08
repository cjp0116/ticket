
drop database if exists ticket_system;
create database ticket_system;
\c ticket_system;

drop table if exists users;
drop table if exists tickets;
drop table if exists notes;

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
  deptCode text REFERENCES departments (deptCode),
  isAdmin BOOLEAN default false
);

create table tickets (
  id SERIAL PRIMARY KEY,
  createdBy TEXT REFERENCES users (username) ON DELETE SET NULL,
  assignedTo TEXT REFERENCES users (username) ON DELETE SET NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  importanceLevel INT,
  closedAt TIMESTAMP,
  isResolved BOOLEAN NOT NULL DEFAULT false,
  subject varchar(200) NOT NULL,
  requestDetail TEXT NOT NULL
);

create table notes (
  ticketID INT REFERENCES tickets (id), 
  createdBy TEXT REFERENCES users (username),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  message TEXT
);

