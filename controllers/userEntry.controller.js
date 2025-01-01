/* import packages */
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');


/* Initilize env config */
dotEnv.config();



/* import another file */
const { userTable } = require('../models/userEntry.model');

const userRegister = async (req , res) => {
    try {
        const { name, email, password } = req.body;
        
        const registerUser = new userTable({
            userName : name,
            userEmail : email,
            userPassword : password
        });
        await registerUser.save();
        return res.status(200).json({ message : 'Register Successfully! '});
    } catch (error) {
        return res.status(404).json({ ErrorMessage : error.message });
    }
};

const userLogin = async (req , res) => {
    try {
        const { email, password } = req.body;    
        const user = await userTable.findOne({ userEmail : email });
        if(!user){
            return res.status(404).json({ mailResponseMessage : 'Invalid Email' });
        }

        const isPasswordMatch = await user.comparePassword(password);
        if(!isPasswordMatch){
            return res.status(404).json({ passwordResponseMessage : 'Invalid Password' });
        }
        const accessToken = await jwt.sign(
            {
                userID : user._id
            },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            {
                expiresIn : '1m'
            }
        );
        const refreshToken = await jwt.sign(
            {
                userID : user._id
            },
            process.env.JWT_REFRESH_TOKEN_SECRET,
            {
                expiresIn : '5m'
            }
        );
        res.cookie('access_token' , accessToken , {
            httpOnly : true,
            secure : false,
            maxAge : 1 * 60 * 1000
        });
        res.cookie('refresh_token' , refreshToken , {
            httpOnly : true,
            secure : false,
            maxAge : 5 * 60 * 1000
        });
        return res.status(200).json({ message : 'LogIn Successfully! ' , access_token : accessToken , refresh_token : refreshToken});
    } catch (error) {
        return res.status(404).json({ ErrorMessage : error.message });
    }
};


const showUser = async (req , res) => {
    try {
        const user = await userTable.findById(req.UserID);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(404).json({ ErrorMessage : error.message });
    }
}

const logOut = async (req , res) => {
    try {
        res.clearCookie('access_token');  // Clear accessToken cookie
        res.clearCookie('refresh_token'); // Clear refreshToken cookie
        return res.status(200).json({message : 'LogOut Successfully...'});
    } catch (error) {
        return res.status(404).json({ ErrorMessage : error.message });
    }
}





/* export this file */
module.exports = {
    userRegister,
    userLogin,
    showUser,
    logOut
}