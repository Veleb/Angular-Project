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

userController.get('/profile', async (req, res) => {
    const userId = req.user?._id;
    const token = req.cookies?.auth; 

    try {
        if (token && userId) {
            const user = await userService.getUserById(userId);

            if (user) {
                return res.status(200).json(user);
            }

            return res.status(404).json({ message: 'User not found!' });
        }

        return res.status(401).json({ message: 'Unauthorized!' });

    } catch (err) {
        res.status(500).json({ message: 'Internal server error!' });
    }
});

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

userController.delete('/:roomId', async (req, res) => {

    const roomId = req.params.roomId;
    const userId = req.user._id;
  
    try {
  
      const response = await userService.removeRoomFromUser(userId, roomId)
      
      res.status(200).json(response);
  
    } catch (err) {
      res.status(400).json({ message: `Error deleting rooms: ${err}` });
    }
  });

export default userController;

// ✔️