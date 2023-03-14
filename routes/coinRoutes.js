const route = require("express").Router();

const {userMiddleware} = require('../middleware/user');

const coinCtrl = require('../controller/coinCtrl');

route.post(`/create`, userMiddleware, coinCtrl.create);
route.post(`/add`, userMiddleware, coinCtrl.add);
route.post(`/remove`, userMiddleware, coinCtrl.remove);
route.get(`/getCoins`, userMiddleware, coinCtrl.getCoins);

module.exports = route;