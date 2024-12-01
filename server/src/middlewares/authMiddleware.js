import { JWT_SECRET } from '../constants.js';
import jwtp from '../libs/jwtp.js';

export const authMiddleware = async (req, res, next) => { // ✔️
  const token = req.cookies?.['auth'];
  
  if (!token) {
    return next();
  }

  try {
    const decodedToken = await jwtp.verify(token, JWT_SECRET);
    
    const user = {
      _id: decodedToken._id,
      username: decodedToken.username,
      accessToken: token,
    }

    req.user = user;
    req.isAuthenticated = true;

    return next();

  } catch (error) {
    return res.status(401).json({ message: "You are not authorized!" });
  }
}

// ✔️