"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authRouter = (0, express_1.Router)();
authRouter.post("/login", async (req, res) => {
    let username = req.body.username;
    let password = await bcrypt_1.default.hash(req.body.password, 10);
    if (!username || !password) {
        res.status(400).send({ message: "Veuillez saisir un identifiant et un mdp valide" });
        return;
    }
    try {
        const connection = await db_1.default.getConnection();
        const [usernameRows] = await connection.execute("SELECT id FROM users WHERE username = ?", [username]);
        if (usernameRows.length == 0) {
            res.status(400).send({ message: "User non trouvé" });
            return;
        }
        const [passwordRows] = await connection.execute("SELECT password FROM users WHERE username = ?", [username]);
        if (passwordRows.length == 0) {
            res.status(400).send({ message: "Mot de passe incorrect" });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(req.body.password, passwordRows[0].password);
        if (!isMatch) {
            res.status(401).send({ message: "Mot de passe incorrect" });
            return;
        }
        res.json({ username });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error login route" });
    }
});
authRouter.post("/register", async (req, res) => {
    let username = req.body.username;
    let password = await bcrypt_1.default.hash(req.body.password, 10);
    if (!username || !password) {
        res.status(400).send({ message: "Veuillez saisir un identifiant et un mdp valide" });
        return;
    }
    try {
        const connection = await db_1.default.getConnection();
        const [usernameRows] = await connection.execute("SELECT id FROM users WHERE username = ?", [username]);
        if (usernameRows.length > 0) {
            res.status(400).send({ message: "User déjà existant" });
            return;
        }
        await connection.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);
        res.status(201).send({ message: "User bien enregistré" });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error register route" });
    }
});
exports.default = authRouter;
