"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const auth_1 = __importDefault(require("./controllers/auth"));
const users_1 = __importDefault(require("./controllers/users"));
const init_1 = require("./config/init");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(cors());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Bienvenue sur mon serveur !');
});
app.use('/auth', auth_1.default);
app.use('/users', users_1.default);
const startServer = async () => {
    try {
        await (0, init_1.initDb)();
        console.log("Base de données initialisée avec succès.");
        app.listen(PORT, () => {
            console.log(`Serveur démarré sur http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Impossible de démarrer le serveur car la DB a échoué:", error);
        process.exit(1);
    }
};
startServer();
