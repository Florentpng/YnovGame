"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = initDb;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("../config/db"));
async function initDb() {
    const sqlPath = path_1.default.join(__dirname, "init.sql");
    if (!fs_1.default.existsSync(sqlPath)) {
        console.log("init.sql introuvable.");
        return;
    }
    const sql = fs_1.default.readFileSync(sqlPath, "utf8");
    const statements = sql
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
    const conn = await db_1.default.getConnection();
    try {
        for (const statement of statements) {
            await conn.execute(statement);
        }
    }
    catch (err) {
        console.error(err.message);
    }
    finally {
        conn.release();
    }
}
