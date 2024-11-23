import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants.js';
const SECRET = JWT_SECRET;

export const authMiddleware = async (req, res, next) => { // ✔️
  const token = req.cookies?.['auth'];
  
  if (!token) {
    return next();
  }

  try {
    const decodedToken = await jwt.verify(token, SECRET);
    
    const user = {
      _id: decodedToken._id,
      username: decodedToken.username
    }

    req.user = user;
    req.isAuthenticated = true;

    return next();

  } catch (error) {
    return res.status(401).json({ message: "You are not authorized!" });
  }
}

// ✔️