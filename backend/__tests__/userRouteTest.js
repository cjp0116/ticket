process.env.NODE_ENV = "test";
const db = require("../db");
const app = require("../app");
const bcrypt = require("bcrypt");
const request = require('supertest');
const sqlForPartialUpdate = require("../helpers/partialUpdate");

