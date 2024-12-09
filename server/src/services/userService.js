import bcrypt from 'bcrypt';
import User from "../models/User.js";
import jwtp from '../libs/jwtp.js';
import { removePassword } from '../utils/auth.js'
import { JWT_SECRET } from '../constants.js';
import mongoose from 'mongoose';

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
    const user = await User.findById(userId)
    .populate('rooms')
    .lean();

    const response = removePassword(user);

    return response;
}

async function getUsers() {
    const users = await User.find().lean();

    const response = users.map(user => removePassword(user));

    return response;
}
   
async function addRoomToUser(userId, roomId) {
    const newUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { rooms: new mongoose.Types.ObjectId(roomId) } },
        { new: true }
    );
    
    return newUser;
}

async function removeRoomFromUser(userId, roomId) {
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { rooms: new mongoose.Types.ObjectId(roomId) } },
        { new: true }
    );

    return updatedUser;
}

async function getUserRooms(userId) {
    const user = await User.findById(userId).populate({ path: 'rooms', model: "Room" }).lean();
    
    return user.rooms;
}  

const userService = { // ✔️
    register,
    login,
    getUserById,
    getUsers,
    addRoomToUser,
    removeRoomFromUser,
    getUserRooms,
    
}

export default userService;

// ✔️