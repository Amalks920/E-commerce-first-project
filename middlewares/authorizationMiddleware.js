const userSchema = require("../model/userSchema");

const authorizationMiddleware = async (req, res, next) => {
  
  let user;
  try {
    if(!req.session.user) return res.redirect("/loginOrSignup");

    user = await userSchema.findById(req?.session?.user?._id);
    console.log(user)
    if (user && user?.isBlocked){
      delete req.session.user;
    }
  
    if (req.session.user && !user.isBlocked) {
      next();
    } else {
      res.redirect("/loginOrSignup");
    }
  } catch (error) {
    console.log(error.message);
  }

 
};

const adminAuthorizationMiddleware = async (req, res, next) => {
  if (req.session.admin) {
    next();
  } else res.redirect("/admin/admin-login");
};

module.exports = { authorizationMiddleware, adminAuthorizationMiddleware };
