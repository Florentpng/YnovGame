"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./controllers/auth"));
const app = (0, express_1.default)();
const PORT = 3000;
app.get('/', (req, res) => {
    res.send('Bienvenue sur mon serveur !');
});
app.listen(PORT, () => {
    console.log(`Serveur demarre sur http://localhost:${PORT}`);
});
app.use('/auth', auth_1.default);
