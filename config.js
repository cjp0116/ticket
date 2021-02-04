require("dotenv").config();
const SECRET = process.env.SECRET_KEY || "prodKey";
const PORT = +process.env.PORT || 3001;
let DB_URI = process.env.NODE_ENV === "test" ? "ticket-test" : "ticket";

console.log('Using databse', DB_URI);
module.exports = {
  SECRET,
  PORT,
  DB_URI
}