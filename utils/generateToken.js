import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    })

    res.cookie("jwt", token, { //creating cookie and storing token in it
        maxAge: 15 * 24 * 60 * 60 * 1000, //for 15 days
        httpOnly: true, //can be accessed only server side not in client side
        sameSite: "strict", //to prevent any kind of attack
        secure: process.env.NODE_ENV === "development", //only for production
    })
}

export default generateTokenAndSetCookie;