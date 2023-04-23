const express = require('express');
const app = express();
router=express.Router();
const administer = require('../Models/admin');
// error class
const ExpressError=require('../utils/ExpressError')
// wrapper err function
const catchAsync = require('../utils/catchAsync');
const bcrypt=require('bcrypt');

var {navactive}=require('../navactive')

navactive=[0,0,0,0,1,0]

//middleware
const {isLoggedIn}=require('../Middlewares/authomiddleware')

//model
const Product = require('../Models/products');


router.get('/adminlogin',(req, res) => {
    navactive=[1,0,0,0,0,0];
    res.render('adminlogin',{navactive:navactive})
})
router.post('/adminlogin',catchAsync(async(req, res) => {
    email=req.body.email;
    password=req.body.password;
    if (!(password&&email)) {
        req.flash('error','All fields are necessary');
        return res.redirect('/admin/adminlogin');
    }
    
    // Validate if user exist in our database
    const admin= await administer.findOne({ email });
    if (admin && (await bcrypt.compare(password, admin.hash))){
        if(req.session.passport){
            delete req.session.passport;
        }
        if(req.session.doctorid){
            delete req.session.doctorid;
        }
        req.session.adminid=admin._id;
        res.redirect('/admin/adminprofile');
    }
    else{
        req.flash('error','Mismatched Credential');
        return res.redirect('/admin/adminlogin');
    }
}))

router.get('/adminprofile',catchAsync(async(req, res) => {
    if(req.session.admin){
        const admini= await administer.findById( req.session.adminid );
        console.log(admini);
        navactive=[1,0,0,0,0,0];
        res.render('adminprofile',{navactive:navactive,admini:admini})
    }
    else{
        req.flash('error','You need to first login');
        return res.redirect('/admin/adminlogin');
    }
    
}))



 


module.exports=router;