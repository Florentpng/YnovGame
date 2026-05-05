import express, { Request, Response } from 'express';
import authRouter from './controllers/auth';
import usersRouter from './controllers/users';

const app = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Bienvenue sur mon serveur !');
});

app.listen(PORT, () => {
    console.log(`Serveur demarre sur http://localhost:${PORT}`);
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);

app.use(express.json());