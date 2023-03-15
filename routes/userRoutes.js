const route = require('express').Router()
const userCtrl = require('../controller/userCtrl');
const {userMiddleware} = require('../middleware/user')

route.post(`/register`, userCtrl.register);
route.post(`/login`, userCtrl.login);
route.get(`/userInfo`, userMiddleware, userCtrl.getUser);
route.post(`/verify/:email`, userCtrl.verifyUser);
route.post(`/resendOtp/:resetEmail`, userCtrl.resetOtp);
route.get(`/logout`, userCtrl.logout);
route.get(`/refreshToken`, userCtrl.refreshToken);

module.exports = route;