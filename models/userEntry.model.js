/* import packages */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


/* create table structure */
const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        unique : true
    },
    userEmail : {
        type : String,
        required : true,
        unique : true
    },
    userPassword : {
        type : String,
        required : true
    }
});


/* prefunction before save */
userSchema.pre('save' , async function(next){
    this.userPassword = await bcrypt.hash(this.userPassword , 10);
    next();
});


/* compare password function */
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password , this.userPassword)
}


/* create table */
const userTable = mongoose.model('user' , userSchema);


/* Export this file */
module.exports = {
    userTable
}
