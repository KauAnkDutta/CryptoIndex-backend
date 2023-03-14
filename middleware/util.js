const jwt = require('jsonwebtoken');
// const config = require('../db/mongo');
const dotenv = require("dotenv").config()


// access token for every user
const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESSTOKENSECRET, {expiresIn: '1d'});
};

// to manage the session
const createRefereshToken = (user) => {
    return jwt.sign(user, process.env.REFRESHTOKENSECRET, { expiresIn: '1d'})
};

module.exports = {createAccessToken, createRefereshToken};