const expressAsycnHandler = require("express-async-handler");
const User = require("../model/userSchema");
const productModal = require("../model/productModal");
const categoryModal = require("../model/categoryModal");
const url = require("url");
const MailGen = require("mailgen");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const userSchema = require("../model/userSchema");
const walletModal = require("../model/walletModal");



const createUser = expressAsycnHandler(async (req, res) => {
  console.log(req.body);
  const { name, email, phone, password } = req.body;

  let findUser = await userSchema.findOne({ email: email });

  if (!findUser) {
    try {
      console.log(req.body);
      console.log(req.body.password[0], req.body.password[1]);
      if (req.body.password[0] === req.body.password[1]) {
        req.body.password = req?.body?.password[0];
      } else {
        res.status(491).json({ msg: "both passwords should be same" });

      }

      let user = await User.create(req.body);

      if (!user.username || !user.email || !user.password)
        return res.status(401).json({ err: "something missing" });

      await walletModal.create({user_id:user?._id})
      res.redirect("/loginOrSignup");
    } catch (error) {
      console.log("db error");
      console.log(error);
      res.status(401).json({ code: error.status, msg: error.message });
    }
  } else {
    
    res.json({
      message: "user already exists",
      success: false,
    });
  }
});

const getUserLogin = expressAsycnHandler(async (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/home");
  }
  console.log(req?.query.isValid);
  res.render("user/loginSignup", { layout: "./layout/signupLogin", req: req });
});

const userLogin = expressAsycnHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //check if user exist or not
  try {
    let findUser = await User.findOne({ email: email });

    if (findUser?.isBlocked === true) {
        res.redirect(
            url.format({
              pathname: "/loginOrSignup",
              query: {
                isValid: "user is blocked",
              },
            })
          );
    }

    //validate the password
    if (
      findUser &&
      (await findUser.isPasswordMatched(password)) &&
      findUser.role === "user"
    ) {
      //destructuring finduser to get details of user
      const { _id, email, isBlocked, name, role, cart, address, wishlist } =
        findUser;

      let data = {
        _id: _id,
        name: name,
        role: role,
        cart: cart,
        wishlist: wishlist,
        email: email,
        isBlocked: isBlocked,
        address: address,
      };
      //making user in session true
      req.session.user = data;

      //send response to client side
      res.redirect("/home");
    } else {
      //if user doesn't exist send error
      res.redirect(
        url.format({
          pathname: "/loginOrSignup",
          query: {
            isValid: "password or username incorrect",
          },
        })
      );
      // res.redirect('/loginOrSignup')
      //   res.status(401).json({msg:"invalid credentials"})
    }
  } catch (error) {
    res.status(401).json({ error: error.message +"  " +error.status });
  }
});

const adminLogin = expressAsycnHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //check if user exist or not
  try {
    let findUser = await User.findOne({ email: email });

    if (findUser?.isBlocked === true) {
      res.status(401).json({ msg: "user is blocked" });
    }

    //validate the password
    if (
      findUser &&
      (await findUser.isPasswordMatched(password)) &&
      findUser.role === "admin"
    ) {
      //making user in session true
      req.session.admin = true;

      //destructuring finduser to get details of user
      const { _id, email, isBlocked, name, role } = findUser;

      //send response to client side
      res.redirect("/admin/admin-home");
    } else {
      //if user doesn't exist send error
      res.redirect(
        url.format({
          pathname: "/admin/admin-login",
          query: {
            isValid: "password or username incorrect",
          },
        })
      );
    }
  } catch (error) {
    res.status(401).json({ error: error.message + " " + error.status });
  }
});


const getAdminLogin = expressAsycnHandler(async (req, res, next) => {
  try {
    if (req.session.admin) return res.redirect("/admin/admin-home");
    res.render("admin/adminLogin", {
      layout: "./layout/adminLoginLayout",
      req: req,
    });
  } catch (error) {
    console.log(error);
  }
});

const getAdminOtpLogin = expressAsycnHandler(async (req, res, next) => {
  try {
    if (req.session.admin) return res.redirect("/admin/admin-home");
    res.render("admin/adminOtpLogin", {
      layout: "./layout/adminLoginLayout",
      req: req,
    });
  } catch (error) {
    console.log(error);
  }
});

const getHomePage = expressAsycnHandler(async (req, res, next) => {
  try {
    const products = await productModal.find({ status: { $ne: "Delisted" } });
    const category = await categoryModal.find({});
    const productCountByCategory = await productModal.aggregate([
      {
        $group: {
          _id: "$productCategory", // Group products by category
          productCount: { $sum: 1 }, // Calculate the count of products in each group
        },
      },
    ]);

    res.render("user/home", {
      layout: "./layout/homeLayout.ejs",
      isLoggedIn: true,
      products: products,
      category,
      productCountByCategory,
    });
  } catch (error) {
    console.log(error.message);
  }
});

const getHomePageNotLoggedIn = expressAsycnHandler(async (req, res, next) => {
  if(req.session.user){
    res.redirect('/home')
  }
  try {
    const products = await productModal.find({ status: { $ne: "Delisted" } });
    const category = await categoryModal.find({});
    const productCountByCategory = await productModal.aggregate([
      {
        $group: {
          _id: "$productCategory", // Group products by category
          productCount: { $sum: 1 }, // Calculate the count of products in each group
        },
      },
    ]);

    res.render("user/home", {
      layout: "./layout/homeLayout.ejs",
      isLoggedIn: false,
      products: products,
      category,
      productCountByCategory,
    });
  } catch (error) {
    console.log(error.message);
  }
});

const getAdminHome = expressAsycnHandler(async (req, res, next) => {
  res.render("admin/admin-home", { layout: "./layout/adminLayout" });
});

const getOtpLogin = async (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/home");
  }

  try {
    res.render("user/otpLogin", { layout: "./layout/signupLogin", req: req });
  } catch (error) {
    console.log(error);
  }
};

const otpLoginPost = async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await userSchema.findOne({ email: req.body.email });
    if (user?.email === req.body.email && user.role==="user") {
      userEmail = req.body.email;
      const EMAIL = process.env.MAILGEN_EMAIL;
      const PASSWORD = process.env.MAILGEN_PASSWORD;

      let config = {
        service: "gmail",
        auth: {
          user: EMAIL,
          pass: PASSWORD,
        },
      };

      let transporter = nodemailer.createTransport(config);

      let MailGenerator = new MailGen({
        theme: "default",
        product: {
          name: "Mailgen",
          link: "https://mailgen.js/",
        },
      });

      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
        digits: true,
      });
      console.log(otp);
      let response = {
        body: {
          Email: userEmail,
          intro: `Your OTP ${otp})}`,

          outro: "Expires within 10 minuites",
        },
      };

      let mail = MailGenerator.generate(response);

      let message = {
        from: EMAIL,
        to: userEmail,
        subject: "Your OTP",
        html: mail,
      };

      transporter
        .sendMail(message)
        .then(async () => {
          req.session.otp = otp;
          req.session.email=user.email
          req.session.isUserOtpSend=true

          console.log(req.session);
          // return res.status(201).json({
          //     msg:"you should receive an email",
          //     otp:otp
          // })
          res.redirect("/verify-otp");
        })
        .catch((error) => {
          console.log(error.message);
          return res.json({ error });
        });
    } else {
      res.redirect(
        url.format({
          pathname: "/otp-login",
          query: {
            err: "invalid email address",
          },
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const getForgotPassword=async (req,res,next) => {
  if(req?.session?.user){
    return res.redirect('/home')
  }
  try {
    res.render('user/forgot-password',{layout:'./layout/signupLogin'})
  } catch (error) {
    console.log(error)
  }
}

const getAdminForgotPassword=async (req,res,next) => {
  if(req?.session?.admin){
    return res.redirect('/admin-home')
  }
  try {
    res.render('admin/forgot-password',{layout:'./layout/adminLoginLayout.ejs',req:req})
  } catch (error) {
    console.log(error)
  }
}

const adminForgotPasswordPost=async(req,res,next)=>{
  try {
    const {email}=req.body
    const user=await userSchema.findOne({email:email})
    if(user && user.role==='admin'){

      res.redirect(
        url.format({
          pathname: "/admin/change-password",
          query: {
            email: `${email}`,
          },
        })
      );
      
    }else{
      res.redirect(
        url.format({
          pathname: "/admin/forgot-password",
          query: {
            err: `invalid email`,
          },
        })
      );
    }
  } catch (error) {
    console.log(error)
  }
}

const getAdminChangePassword=async (req,res,next)=>{

  if(req?.session?.admin){
    return res.redirect('/admin-home')
  }

  console.log(req.query.email)
  try {
    res.render('admin/change-password',{layout:'./layout/adminLoginLayout.ejs',req:req})
  } catch (error) {
    console.log(error)
  }
} 

const adminChangePasswordPost=async (req,res,next)=>{
  const {oldPassword,newPassword,email}=req.body
   try {
     const findUser=await User.findOne({email:email})
    //  console.log(await findUser.isPasswordMatched(oldPassword))
    //  if((await findUser.isPasswordMatched(oldPassword))){
       findUser.password=newPassword;
       findUser.save()
       res.redirect('/admin/admin-login')
    //  }else{
    //    console.log('failed')
    //  }
   } catch (error) {
     console.log(error)
   }
 }

const forgotPasswordPost=async(req,res,next)=>{
  try {
    const {email}=req.body
    const user=await userSchema.findOne({email:email})
    if(user && user.role==='user'){

      res.redirect(
        url.format({
          pathname: "/change-password",
          query: {
            email: `${email}`,
          },
        })
      );
      
    }else{
      res.redirect(
        url.format({
          pathname: "/forgot-password",
          query: {
            err: `invalid email`,
          },
        })
      );
    }
  } catch (error) {
    console.log(error)
  }
}

const changePassword=async (req,res,next)=>{
  if(req?.session?.user){
    return res.redirect('/home')
  }
  console.log(req.query.email)
  try {
    res.render('user/change-password',{layout:'./layout/signupLogin',req:req})
  } catch (error) {
    console.log(error)
  }
} 

const changePasswordPost=async (req,res,next)=>{
 const {oldPassword,newPassword,email}=req.body
  try {
     const findUser=await User.findOne({email:email})
     console.log(findUser)
    // console.log(await findUser.isPasswordMatched(oldPassword))
    // if((await findUser.isPasswordMatched(oldPassword))){
      findUser.password=newPassword;
      findUser.save()
      res.redirect('/loginOrSignup')
    // }else{
    //   console.log('failed')
    // }
  } catch (error) {
    console.log(error)
  }
}

const adminOtpLoginPost = async (req, res, next) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });

    if (user?.email === req.body.email && user.role === "admin") {
      userEmail = req.body.email;
      const EMAIL = process.env.MAILGEN_EMAIL;
      const PASSWORD = process.env.MAILGEN_PASSWORD;

      let config = {
        service: "gmail",
        auth: {
          user: EMAIL,
          pass: PASSWORD,
        },
      };

      let transporter = nodemailer.createTransport(config);

      let MailGenerator = new MailGen({
        theme: "default",
        product: {
          name: "Mailgen",
          link: "https://mailgen.js/",
        },
      });

      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
        digits: true,
      });
      console.log(otp);
      let response = {
        body: {
          Email: userEmail,
          intro: `Your OTP ${otp})}`,

          outro: "Expires within 10 minuites",
        },
      };

      let mail = MailGenerator.generate(response);

      let message = {
        from: EMAIL,
        to: userEmail,
        subject: "Your OTP",
        html: mail,
      };

      transporter
        .sendMail(message)
        .then(async () => {
          req.session.otp = otp;
          req.session.isOtpSend=true
          console.log(req.session);
          // return res.status(201).json({
          //     msg:"you should receive an email",
          //     otp:otp
          // })
          res.redirect("/admin/verify-otp-login");
        })
        .catch((error) => {
          console.log(error.message);
          return res.json({ error });
        });
    } else {
      
      res.redirect(
        url.format({
          pathname: "/admin/admin-otp-login",
          query: {
            err: "invalid email address",
          },
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const getAdminVerifyOtpLogin = async (req, res, next) => {

  if(!req.session.isOtpSend){
    return res.redirect('/admin/admin-login')
  }
  if (req.session.admin) {
    return res.redirect("/admin/admin-home");
  }

  try {
    console.log("otp otp otp ");
    console.log(req.session);
    res.render("admin/admin-verify-otp", {
      layout: "./layout/adminLoginLayout.ejs",
      req: req,
    });
  } catch (error) {}
};

const verifyOtpAdminPost = async (req, res, next) => {
  try {
    if (req.body.otp === req.session.otp) {
      req.session.admin = true;
      res.redirect("/admin/admin-home");
    } else {
      res.redirect(
        url.format({
          pathname: "/admin/verify-otp-login",
          query: {
            err: "invalid OTP",
          },
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const getVerifyOtp = async (req, res, next) => {
  


  if(!req.session.isUserOtpSend){
    return res.redirect('/loginOrSignup')
  }
  if (req.session.user) {
    return res.redirect("/home");
  }

  try {
    console.log("otp otp otp ");
    console.log(req.session);
    res.render("user/verifyOtp", { layout: "./layout/signupLogin", req: req });
  } catch (error) {}
};

const verifyOtpPost = async (req, res, next) => {
  try {
    const user=await userSchema.findOne({email:req.session.email})

    if (req.body.otp === req.session.otp) {
      req.session.user = user;
      res.redirect("/home");
    } else {
      res.redirect(
        url.format({
          pathname: "/verify-otp",
          query: {
            err: "invalid OTP",
          },
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  try {
    delete req.session.user;
    res.redirect("/loginOrSignup");
  } catch (error) {
    console.log(error.message);
  }
};

const adminLogout = async (req, res) => {
  try {
    delete req.session.admin;
    res.redirect("/admin/admin-login");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  adminLogin,
  getUserLogin,
  getAdminLogin,
  getAdminOtpLogin,
  getForgotPassword,
  createUser,forgotPasswordPost,
  adminOtpLoginPost,
  userLogin,changePassword,
  getAdminVerifyOtpLogin,
  getHomePage,
  getHomePageNotLoggedIn,
  getAdminHome,
  verifyOtpAdminPost,
  logout,
  adminLogout,
  getOtpLogin,
  otpLoginPost,
  getVerifyOtp,
  verifyOtpPost,
  changePasswordPost,
  getAdminForgotPassword,adminForgotPasswordPost,
  getAdminChangePassword,adminChangePasswordPost
};
