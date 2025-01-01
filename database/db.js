/* import package */
const mongoose = require('mongoose');
const dotEnv = require('dotenv');

/* Initilize env config */
dotEnv.config();

/* db connect function */
const connectDB = async (req , res) => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Databse connected!');
    }catch(error){
        console.log(error.message);
        process.exit(1);
    }
};


/* export file */
module.exports = {
    connectDB
};