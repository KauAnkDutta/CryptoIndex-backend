const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const {createAccessToken, createRefereshToken} = require('../middleware/util');
const nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    }
});

const otpMap = new Map()

function generateOtp(){
    const otp = Math.floor(100000 + Math.random()* 900000);

    const expirationTime = Date.now() + 1 * 60 * 1000;

    otpMap.set(otp, expirationTime);
    
    return otp;
}

function verifyOTP(otp){
    if(!otpMap.has(otp)){
        return false
    }

   const expirationTime = otpMap.get(otp)

   if(expirationTime < Date.now()){
    otpMap.delete(otp)
    return false
   }

   //if otp is valid, remove it from the Map and return true
   otpMap.delete(otp)
   return true;
}

const userCtrl = {
    register: async(req, res) => {
        try {
            const {email, name, password} = req.body;

            const hash_password = await bcrypt.hash(password, 10)

            const newUser = new User({
                email: email,
                name: name,
                password: hash_password,
            })

            const extEmail = await User.findOne({email})
            if(extEmail){
                return res.status(400).json({msg: "Email Exist"})
            }

            await newUser.save();

            res.status(200).json({msg: "User Registered Successfully"})

        } catch (error) {
            res.status(500).json({msg: 'Requested can not be completed.'}) 
        }
    },

    login: async(req, res) => {
        try {
            const {email, password} = req.body;
            const Token = generateOtp();

            const extUser = await User.findOne({email});
            if(!extUser){
                return res.status(400).json({msg:"User Doesn't exist"})
            }
                
            const isMatch = await bcrypt.compare(password, extUser.password);

            if(!isMatch){
                return res.status(400).json({msg: "Password doesn't match"})
            }

            const refreshToken = createRefereshToken({id: extUser._id})

            if(Token){
                // ---------------
                res.cookie('r-token', refreshToken, {
                    httpOnly: true,
                    maxAge: 86400000, // 1 day in milliseconds
                    secure: true, // Set this to true if your website is hosted on HTTPS
                    sameSite: 'none', // Set this to 'none' if you want to allow cross-site cookies
                    domain: "https://cryptoindex-frontend.onrender.com/login"
                  });
                // ---------------

                var mailOptions = {
                    from: process.env.USER,
                    to: email,
                    subject: 'App Testing',
                    text: `${Token}`
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if(error){
                        res.status(500).json("OTP Generation Failed")
                    }else{
                        res.status(200).json({
                            "email": extUser.email
                        })
                    }
                })
            }else{
                res.status(500).json("Fail to generate token")
            }
        } catch (error) {
            res.status(500).json({msg: 'Requested can not be completed.'}) 
        }
    },

    verifyUser: async(req, res) => {
        const email = req.params.email;

        const {token} = req.body;

        const  extUser = await User.findOne({email})

        const accessToken = createAccessToken({id: extUser._id})

        const refreshToken = createRefereshToken({id: extUser._id})

        try {
            const verify = verifyOTP(token)

            if(verify){
                res.status(200).json({
                    verify: verify,
                    accessToken: accessToken,
                });
            }else{
                res.status(500).json({msg:"failed to verify"});
            }

        } catch (error) {
            res.status(500).json({msg: "Request can not be completed"})
        }
    }, 

    resetOtp: (req, res) => {
        const email = req.params.resetEmail;

        try {
            const otp = generateOtp()
            if(otp){
                var mailOptions = {
                    from: process.env.USER,
                    to: email,
                    subject: "App Testing",
                    text: `${otp}`
                }

                transporter.sendMail(mailOptions, (err, info) => {
                    if(err){
                        res.status(500).json({msg: "OTP Generation Failed"})
                    }else{
                        res.status(200).json({
                            token: otp,
                            info: info.response,
                        })
                    }
                })
            }
        } catch (error) {
            res.status(500).josn({msg: "Request can not be completed"})
        }
    },

    logout: async(req, res) => {
        try {
            res.clearCookie("refreshToken")

            res.status(200).json({msg: "Logout Successfull"})
        } catch (error) {
            res.status(500).json({msg: 'Requested can not be completed.'}) 
        }
    },

    getUser: async(req, res) => {
        let id = req.user.id
        try {
            const user = await User.findById(id)
            const {name, email} = user
            if(!user){
                return res.status(400).json({msg: "User Does Not Exist"})
            }
            return res.status(200).json({"userInfo": {email: email, name: name}})
        } catch (error) {
            res.status(500).json({msg: 'Requested can not be completed.'}) 
        }
    },

    refreshToken: (req, res) => {
        try {
            const Token = req.cookies.refreshToken;
            // console.log("request----------->",req)
            if(!Token){
                return res.status(400).json({msg: "Session expired, Login Again..."})
            }
            jwt.verify(Token, process.env.REFRESHTOKENSECRET, (err, user) => {
                if(err){
                    return res.status(400).json({msg: "Session Expired, Login Again..."})
                }

                const accessToken = createAccessToken({id: user.id})
                res.status(200).json({token: accessToken})
            })
        } catch (error) {
            res.status(500).json({msg: 'Requested can not be completed.'}) 
        }
    },
}

module.exports = userCtrl
