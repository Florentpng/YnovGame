import fs from "fs";
import path from "path";
import pool from "../config/db";

async function initDb(): Promise<void> {
  const sql = fs.readFileSync(path.join(__dirname, "init.sql"), "utf8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  const conn = await pool.getConnection();
  try {
    for (const statement of statements) {
      await conn.execute(statement);
    }
  } catch (err) {
    console.error((err as Error).message);
  } finally {
    conn.release();
    process.exit();
  }
}

initDb();
