const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const app=express();
const dotenv=require('dotenv').config();
const dbConnect=require('./config/dbConnect')
const cookieParser=require('cookie-parser')
const nocache = require("nocache");
const logger = require('morgan');

const authRoute=require('./routes/userRoute')
const adminRoute=require('./routes/adminRoute')
const categoryRoute=require('./routes/categoryRoute')
const productRoute=require('./routes/productRoute')

const path=require('path')
const session = require('express-session');
const exp = require('constants');
const { type } = require('os');

const PORT=process.env.PORT || 4000



app.use(nocache())
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, "javascript")));
app.use(logger('dev'));
app.use(express.static('public'))
app.use(express.static('public/admin'))
app.use(express.static('public/images/homepage'))
app.use(express.static('public/admin/adminLogin'))
app.use(express.static('public/admin-assets'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(session({ secret: "Private", resave: true, saveUninitialized: true}))

//set templating engine

app.use(expressLayouts)
app.set('layout','./layout/layout')
app.set('view engine','ejs')

//router
app.use('/',authRoute)
app.use('/admin',adminRoute)
app.use('/admin/category',categoryRoute)
app.use('/admin/product',productRoute)





dbConnect()




app.listen(PORT,()=>{
    console.log(`app is running at port ${PORT}`)
})