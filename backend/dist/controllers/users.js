"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    try {
        const [rows] = await db_1.default.query("SELECT id, USER_NAME, isDev, createdAt FROM USERS");
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const [rows] = await db_1.default.query("SELECT id, USER_NAME, isDev, createdAt FROM USERS WHERE id = ?", [req.params.id]);
        if (rows.length === 0) {
            res.status(404).json({ error: "User non trouvé" });
            return;
        }
        res.json(rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
