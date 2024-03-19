import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try
    {
        const token = req.cookies.jwt;
        if(! token)
        {
            return res.status(401).json({error: "Please login to access this resource"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(! decoded)
        {
            return res.status(401).json({error: "Please login to access this resource"});
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(! user)
        {
            return res.status(401).json({error: "User not found"});
        }
        req.user = user; //now, info of authenticated user is present in req.user
        next();
    }
    catch(error)
    {
        console.log("Error while protectRoute middleware is ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export default protectRoute;