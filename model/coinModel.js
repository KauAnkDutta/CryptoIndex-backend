const mongoose = require("mongoose");

const coinSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usersecret",
        required: true
    },

    cryptos: [
        {
            type: Object,
            default: {}
        }
    ],
},{
    timestamps: true,
    collection: "coins"
})

module.exports = mongoose.model("coins", coinSchema)