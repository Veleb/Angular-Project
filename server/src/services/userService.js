import bcrypt from 'bcrypt';
import User from "../models/User.js";
import jwtp from '../libs/jwtp.js';
import { removePassword } from '../utils/auth.js'
import { JWT_SECRET } from '../constants.js';

async function register({username, password}) { // ✔️

    const user = await User.findOne({ username });

    if (user) {
        throw new Error('User already exists');
    }

    const createdUser = await User.create({ username, password });
    
    const result = generateResponse(createdUser);
    
    return result;
}

async function login({username, password}) { // ✔️
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

async function generateResponse(user) { 
    const payload = {
        _id: user._id,
        username: user.username,
    };


    try {
        const token = await jwtp.sign(payload, JWT_SECRET, { expiresIn: '2h' });

        return {
            _id: user._id,
            username: user.username,
            accessToken: token,
            userProducts: user.userProducts,
            created_at: user.created_at, 
            updatedAt: user.updatedAt,
        };
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error('Token generation failed');
    }
}

async function getUserById(userId) {
    const user = await User.findById(userId).lean();

    const response = removePassword(user);

    return response;
}

async function getUsers(userId) {
    const users = await User.find().lean();

    const response = users.map(user => removePassword(user));

    return response;
}   

const userService = { // ✔️
    register,
    login,
    getUserById,
    getUsers
}

export default userService;

// ✔️