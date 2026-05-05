import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      "SELECT id, USER_NAME, isDev, createdAt FROM USERS",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      "SELECT id, USER_NAME, isDev, createdAt FROM USERS WHERE id = ?",
      [req.params.id],
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "User non trouvé" });
      return;
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
