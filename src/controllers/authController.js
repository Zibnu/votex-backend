const jwt = require("jsonwebtoken");
const { User } = require("../models");

const SECRET = process.env.SECRET_KEYS;
const EXPIRES_IN = "7d";// ubah menjadi 2h ketika sudah selesai pembuatan

//🔥🔥
exports.register = async ( req, res ) => {
    try {
        const { username, nisn} = req.body;

        if(!username || !nisn) {
            return res.status(400).json({
                success : false,
                message : "username and nisn required"
            });
        }

        const existingUser = await User.findOne({ where : { nisn }});
        if(existingUser) {
            return res.status(409).json({
                success : false,
                message : "User already Exists",
            });
        }

        const newUser = await User.create({
            username,
            nisn,
        });

        const userResponse = {
            id_user : newUser.id_user,
            username : newUser.username,
            nisn : newUser.nisn,
            password : newUser.password,
            role : newUser.role,
        };

        return res.status(201).json({
            success : true,
            message : "Register Success",
            data : userResponse,
        });
    } catch (error) {
        console.error("Regiter ERROR", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server ERROR",
            error : error.message,
        });
    };
};

// 🔥🔥
exports.login = async (req, res ) => {
    try {
        const { nisn, password } = req.body;

        if(!nisn || !password) {
            return res.status(401).json({
                success : false,
                message : "Nisn and Password not Null",
            });
        }

        const user = await User.findOne({ where : {nisn}});

        if(!user) {
            return res.status(404).json({
                success : false,
                message : "User Not Found",
            });
        }

        if(user.password !== password) {
            return res.status(401).json({
                success : false,
                message : "Wrong Password",
            });
        }

        const token = jwt.sign(
            {
                id_user : user.id_user,
                role : user.role,
            },
            SECRET,
            { expiresIn : EXPIRES_IN},
        );

        return res.status(201).json({
            success : true,
            message : "Login SuccessFull",
            data : {
                token,
                user : {
                    id_user : user.id_user,
                    username : user.username,
                    role : user.role,
                    has_voted : user.has_voted,
                },
            }
        });
    } catch (error) {
        console.error("Login Error", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
}