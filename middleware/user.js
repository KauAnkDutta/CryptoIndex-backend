const jwt = require('jsonwebtoken');
// const config = require('../db/mongo');
const dotenv = require("dotenv").config();

const userMiddleware = async(req, res, next) => {
    try {
        const token = req.header("Authorization");

        jwt.verify(token, process.env.ACCESSTOKENSECRET, (err, user) => {
            if(err){
                return res.status(500).json({msg: "Please Sign In"})
            }

            req.user = user;
            next();
        })
    } catch (error) {
        return res.status(500).json({msg: "Request cannot be completed"})
    }
}

module.exports = {userMiddleware}