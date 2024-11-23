import { Router } from 'express';
import userService from '../services/userService.js';

const userController = Router();

userController.post('/register', async (req, res) => { // ✔️
    
    try {

        const { username, password } = req.body; // change if needed

        const result = await userService.register(username, password);

        res.cookie("auth", result, { httpOnly: true });

        res.json(result);
        
    } catch (err) {
        res.status(400).json({ message })
    }
});

userController.post('/login', async (req, res) => { // ✔️
    const { username, password } = req.body;

    try {
        const result = await userService.login(username, password);

        res.cookie("auth", result, { httpOnly: true });

        res.json(result);
        
    } catch (err) {
        res.status(400).json({ message })
    }
});

userController.get('/logout', (req, res) => { // ✔️
    res.clearCookie('auth');

    res.status(204).end();
});

export default userController;

// ✔️