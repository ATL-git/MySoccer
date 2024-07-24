require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const usersRouter = require("./routers/usersRouter");
const teamsRouter = require("./routers/teamsRouter")

const app = express();
app.use(express.static('./publics'));
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: process.env.CRYPTSESS
}))
app.use(express.urlencoded({extended: true}));
app.use(usersRouter);
app.use(teamsRouter);

app.listen(process.env.PORT,(err)=>{
    if (err) {
        console.log(err);
    }else{
        console.log('connecté');
    }
});

mongoose.connect(process.env.MONGO);