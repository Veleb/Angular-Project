import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import { JWT_SECRET } from '../constants.js';

async function register(username, password) { // ✔️

    const user = await User.findOne({ username });

    if (user) {
        throw new Error('User already exists');
    }

    const createdUser = await User.create({ username, password });

    const result = generateResponse(createdUser);
    return result;
}

async function login(username, password) { // ✔️
    const user = await User.findOne({ username });

    if (!user) {
        throw new Error('Invalid username or password');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Invalid username or password');
    }

    const result = generateResponse(user);

    return result;
}

function generateResponse(user) { //✔️ 
    const payload = {
        _id: user._id,
        username: user.username,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    return {
        _id: user._id,
        username: user.username,
        accessToken: token,
    };
}

const userService = { // ✔️
    register,
    login,
}

export default userService;

// ✔️