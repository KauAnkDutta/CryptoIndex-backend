const Coin = require('../model/coinModel');

const coinCtrl = {
    create: async(req, res) => {
        try {
            const userId = req.user.id;
            const existing_watchlist = await Coin.findOne({userId: userId})

            if(existing_watchlist){
                res.status(200).json("Watchlsit ready")
            }else{
                const newWatclist = Coin({
                    userId: userId,
                })

                await newWatclist.save();
                res.status(200).json({msg: "Created"})
            }

        } catch (error) {
            res.status(500).json({msg: "Action Cannot Be Completed"})
        }
    },

    add: async(req, res) => {
        try {
           const userId = req.user.id;

           const existing_watchlist = await Coin.findOne({userId: userId})

           const coin_name = req.body.cryptos.name;

           const coin_added = existing_watchlist.cryptos.find(obj => obj.name == coin_name);

           if(coin_added){
                res.status(200).json(`${coin_name} Has Already Been Added`)
           }else{
            await Coin.findOneAndUpdate({userId: userId},{
                $push: {cryptos: req.body.cryptos}
            })

            res.status(200).json({msg: `${coin_name}Add to the Watchlsit`})
           }
        } catch (error) {
            res.status(500).json(error)
        }
    },

    remove: async(req, res) => {
        try {
            const name = req.body.cryptos.name;
            const userId = req.user.id;
            if(name){
                await Coin.updateOne({userId: userId}, {
                    $pull:{
                        cryptos: {name: name}
                    }
                })
            }

            res.status(200).json({msg: `${name} Removed Successfully`})
        } catch (error) {
            res.status(500).json({msg: "Action Cannot Be Completed At This Moment"})
        }
    },

    getCoins: async(req, res) => {
        try {
            const userId = req.user.id;
            const userWatchlist = await Coin.findOne({userId: userId})

            if(userWatchlist){
                res.status(200).json({coins: userWatchlist.cryptos})
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = coinCtrl;