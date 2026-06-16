import express, { Request, Response } from 'express';
const cors = require('cors');
import authRouter from './controllers/auth';
import usersRouter from './controllers/users';
import { initDb } from './config/init';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Bienvenue sur mon serveur !');
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);

const startServer = async () => {
    try {
        await initDb(); 
        console.log("Base de données initialisée avec succès.");

        app.listen(PORT, () => {
            console.log(`Serveur démarré sur http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Impossible de démarrer le serveur car la DB a échoué:", error);
        process.exit(1);
    }
};

startServer();