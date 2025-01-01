/* import packages */
const express = require('express');


/* Initialise packages */
const userEntryRouter = express.Router();


/* import file */
const { userRegister , userLogin , showUser , logOut } = require('../controllers/userEntry.controller');
const { authenticateJWT } = require('../middlewares/library');



/* Routers */
userEntryRouter.post('/register' , userRegister);
userEntryRouter.post('/login' , userLogin);
userEntryRouter.get('/showUser' , authenticateJWT , showUser);
userEntryRouter.get('/logOut' , logOut);




/* export this file */
module.exports = {
    userEntryRouter
}