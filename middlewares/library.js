/* import packages */
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');


/* Initilize env config */
dotEnv.config();


const authenticateJWT  = async (req , res , next) => {
    try {
        const cookieValue = req.cookies;
        console.log( cookieValue);
        if(cookieValue === undefined){

            return res.status(404).json({ cookieMessage : 'No token available' });

        }else{
            if(cookieValue.access_token != undefined){

                const decoded = jwt.verify(cookieValue.access_token , process.env.JWT_ACCESS_TOKEN_SECRET);
                req.UserID = decoded.userID;
                next();

            }else if(cookieValue.refresh_token != undefined){

                const decoded = jwt.verify(cookieValue.refresh_token , process.env.JWT_REFRESH_TOKEN_SECRET);
                const accessToken = await jwt.sign(
                    {
                        userID : decoded.userID
                    },
                    process.env.JWT_ACCESS_TOKEN_SECRET,
                    {
                        expiresIn : '1m'
                    }
                );
                res.cookie('access_token' , accessToken , {
                    httpOnly : true,
                    secure : false,
                    maxAge : 1 * 60 * 1000
                });
                req.UserID = decoded.userID;
                console.log('access token refreshed' , accessToken);
                next();

            }else{
                return res.status(404).json({ cookieMessage : 'No token available' });
            }
        }
    } catch (error) {
        return res.status(404).json({ ErrorMessage : error.message });
    }
};



/* export this file */
module.exports = {
    authenticateJWT
}