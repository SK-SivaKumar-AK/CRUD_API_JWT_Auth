/* import packages */
const express = require('express');
const cookieParser = require('cookie-parser');



/* Initialise packages */
const app = express();


/* import file */
const { userEntryRouter } = require('./routes/userEntry.route');
const { connectDB } = require('./database/db');


/* Middleware use */
connectDB();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser()); 


/* Routes */
app.use('/api' , userEntryRouter);


/* port listen */
app.listen(3000 , () => {
    console.log('Server connected...!');
});