import { Router } from 'express';
import userService from '../services/userService.js';

const userController = Router();

userController.post('/register', async (req, res) => { // ✔️
    try {
        
        const { username, password } = req.body;

        const result = await userService.register({username, password});
        
        res.cookie("auth", result.accessToken, { httpOnly: true });

        res.json(result);
        
    } catch (message) {
        res.status(400).json({ message })
    }
});

userController.post('/login', async (req, res) => { // ✔️
    const { username, password } = req.body;

    try {
        const result = await userService.login({username, password});

        res.cookie("auth", result.accessToken, { httpOnly: true });

        res.json(result);
        
    } catch (message) {
        res.status(400).json({ message })
    }
});

userController.get('/logout', (req, res) => { // ✔️
    res.clearCookie('auth');

    res.status(204).end();
});

export default userController;

// ✔️