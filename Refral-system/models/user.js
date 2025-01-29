const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,     
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String, 
    },
    refBy: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" ,
            default: null
        },
    referredUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    levels: {
        level1: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        level2: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        level3: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        level4: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        level5: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
    }
    

}, {timestamps: true})

const User = mongoose.model("User", userSchema);

module.exports = User;

