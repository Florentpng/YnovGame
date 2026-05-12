import fs from "fs";
import path from "path";
import pool from "../config/db";

export async function initDb(): Promise<void> {
  const sqlPath = path.join(__dirname, "init.sql");

  if (!fs.existsSync(sqlPath)) {
    console.log("init.sql introuvable.");
    return;
  }

  const sql = fs.readFileSync(sqlPath, "utf8");

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
    // process.exit();
  }
}
