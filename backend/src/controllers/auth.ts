import { Router, Request, Response } from "express";
import pool from "../config/db";

const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response) => {
    let username = req.body.username
    let password = req.body.password;

    try {
        const connection = await pool.getConnection();

        const users = await connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        if (users.length === 0) {
            res.status(401).send({ message: 'Invalid username or password' });
            return;
        } 

        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error fetching users' });
    }
});

authRouter.post('/register', async (req: Request, res: Response) => {
    let username = req.body.username;
    let password = req.body.password;

    try {
        const connection = await pool.getConnection();

        const users = await connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        if (users.length > 0) {
            res.status(400).send({ message: 'User already exists' });
            return;
        }

        await connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);

        res.status(201).send({ message: 'User registered successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error fetching users' });
    }

});

export default authRouter;