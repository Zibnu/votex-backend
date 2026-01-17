const jwt = require("jsonwebtoken");
const {User} = require("../models");

const SECRET = process.env.SECRET_KEYS;

// verify token
exports.authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startWith("Bearer ")) {
            return res.status(401).json({
                success : false,
                message : "No Token Provided",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, SECRET);

        const user = await User.findByPk(decoded.id_user);

        if(!user) {
            return res.status(404).json({
                success : false,
                message : "User Not Found",
            });
        }

        req.user = {
            id_user : user.id_user,
            username : user.username,
            role : user.role,
        };

        next();
    } catch (error) {
        if(error.name === "JsonWebTokenError"){
            return res.status(401).json({
                success : false,
                message : "Invalid Token",
            });
        }

        if(error.name === "TokenExpiredError"){
            return res.status(401).json({
                success : false,
                message : "Token Expired",
            });
        }

        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
        });
    }
};

// Check Admin
exports.isAdmin = async (req, res, next) => {
    if(req.user.role !== "admin") {
        return res.status(403).json({
            success : false,
            message : "Acess denied, admin only"
        });
    }

    next();
};