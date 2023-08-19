const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const app=express();
const dotenv=require('dotenv').config();
const dbConnect=require('./config/dbConnect')
const cookieParser=require('cookie-parser')


const authRoute=require('./routes/authenticationRoute')
const adminRoute=require('./routes/adminRoute')
const categoryRoute=require('./routes/categoryRoute')
const productRoute=require('./routes/productRoute')

const path=require('path')
const session = require('express-session');
const exp = require('constants');

const PORT=process.env.PORT || 4000


app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'))
app.use(express.static('public/admin'))
app.use(express.static('public/admin/adminLogin'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(session({ secret: "Private", resave: true, saveUninitialized: true,
 cookie:{secure: false, // Set to true if using HTTPS
 maxAge: 86400000 }}))


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