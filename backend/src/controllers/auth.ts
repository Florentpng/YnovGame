import { Router, Request, Response } from "express";
import pool from "../config/db";
import bcrypt from 'bcrypt';

const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response) => {
    console.log("Login request received with body:", req.body);
    let username = req.body.username
    let password = req.body.password;

    try {
        const connection = await pool.getConnection();

        const users = await connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        if (users) {
            res.status(401).send({ message: 'identifiant ou mdp incorrect' });
            return;
        } 

        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Erreur avec un user' });
    }
});

authRouter.post('/register', async (req: Request, res: Response) => {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        res.status(400).send({ message: 'Veuillez saisir un identifiant et un mdp valide'});
        return;
    }

    try {
        const connection = await pool.getConnection();

        const users = await connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        if (users.length > 0) {
            res.status(400).send({ message: 'User déjà existant' });
            return;
        }

        await connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);

        res.status(201).send({ message: 'User bien enregistré' });

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Erreur avec un user' });
    }

});

export default authRouter;