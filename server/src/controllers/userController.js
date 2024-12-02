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

userController.get('/profile', async (req, res) => { // ✔️
    const userId = req.user?._id;
    
    try {
        const response = await userService.getUserById(userId);
        
        res.json(response);


    } catch(err) {
        res.status(401).json(`You are not authorized!`)
    }

})

userController.get('/profiles', async (req, res) => { // ✔️
    try {
        const response = await userService.getUsers();
        
        res.json(response);


    } catch(err) {
        res.status(400).json(`Error fetching profiles: ${err.message}`)
    }

})

userController.get('/profile/:profileId', async (req, res) => { // ✔️
    const profileId = req.params.profileId;
    
    try {
        const response = await userService.getUserById(profileId);
        
        res.json(response);


    } catch(err) {
        res.status(400).json(`Error fetching profile: ${err.message}`)
    }

})

export default userController;

// ✔️