import express from "express";
import dotenv from "dotenv";
import pkg from "pg";

const { Pool } = pkg;

dotenv.config();

const app = express();
const PORT = 3001;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Database connection error:", err.stack));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Complaint Backend API is running!");
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(express.json());

// ================= USERS ROUTES =================

// Ambil semua user
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Tambah user baru
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Update user berdasarkan id
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const result = await pool.query(
      "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *",
      [name, email, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Hapus user berdasarkan id
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id=$1", [id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});
