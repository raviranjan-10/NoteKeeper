//import mongoose 
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//user Schema model
const userSchema = new Schema({
    fullName : {type : String},
    email : {type : String},
    password : {type : String},
    createdOn : {type : Date, default : new Date().getTime()},
});

module.exports = mongoose.model("User",userSchema);
