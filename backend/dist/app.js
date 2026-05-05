const express = require("express");
const app = express();
const pool = require("../src/db");

app.use(express.json());

app.get("/users", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const users = await connection.query("SELECT * FROM users");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error fetching users" });
  } finally {
    if (connection) connection.release();
  }
});

app.post("/users", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query("INSERT INTO users SET ?", req.body);
    res.json({ message: "User added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error adding user" });
  } finally {
    if (connection) connection.release();
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
