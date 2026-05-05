"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const authRouter = (0, express_1.Router)();
authRouter.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    try {
        const connection = await db_1.default.getConnection();
        const users = await connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        if (users.length === 0) {
            res.status(401).send({ message: 'Invalid username or password' });
            return;
        }
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error fetching users' });
    }
});
authRouter.post('/register', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    try {
        const connection = await db_1.default.getConnection();
        const users = await connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        if (users.length > 0) {
            res.status(400).send({ message: 'User already exists' });
            return;
        }
        await connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        res.status(201).send({ message: 'User registered successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error fetching users' });
    }
});
exports.default = authRouter;
