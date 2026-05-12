import { Router, Request, Response } from "express";
import pool from "../config/db";
import bcrypt from "bcrypt";

const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response) => {
    let username = req.body.username;

    try {
        const connection = await pool.getConnection();

        

        const result = await connection.query("SELECT password FROM users WHERE username = ?", [username]);
        const userPassword: Array<{ password: string }> = JSON.parse(JSON.stringify(result));

        if (!userPassword.length) {
            res.status(401).send({ message: "mdp incorrect" });
            return;
        }

        const isMatch = await bcrypt.compare(req.body.password, userPassword[0].password);
        if (!isMatch) {
            res.status(401).send({ message: "mdp incorrect" });
            return;
        }

        res.json({ username });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error login route" });
    }
});

authRouter.post("/register", async (req: Request, res: Response) => {
    let username = req.body.username;
    let password = await bcrypt.hash(req.body.password, 10);

    if (!username || !password) {
        res
            .status(400)
            .send({ message: "Veuillez saisir un identifiant et un mdp valide" });
        return;
    }

    try {
        const connection = await pool.getConnection();

        const users = await connection.query("SELECT * FROM users WHERE username = ?", [username]);

        if (users.length > 0) {
            res.status(400).send({ message: "User déjà existant" });
            return;
        }

        await connection.query(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, password],
        );

        res.status(201).send({ message: "User bien enregistré" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error register route" });
    }
});

export default authRouter;