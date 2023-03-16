const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
    },

    name: {
        type: String,
        trim: true,
    },

    password: {
        type: String,
        trim: true,
    }, 
},{
    timestamps: true,
    collection: "usersecret"
})

module.exports = mongoose.model("userSecret", userSchema);