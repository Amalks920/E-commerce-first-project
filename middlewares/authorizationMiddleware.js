const userSchema = require("../model/userSchema");

const authorizationMiddleware = async (req, res, next) => {
  let user;
  try {
    user = await userSchema.findById(req.session.user._id);

    if (user?.isBlocked){
      delete req.session.user;
    }
  
    if (req.session.user && !user.isBlocked) {
      next();
    } else {
      res.redirect("/loginOrSignup");
    }
  } catch (error) {
    console.log(error);
  }

 
};

const adminAuthorizationMiddleware = async (req, res, next) => {
  if (req.session.admin) {
    next();
  } else res.redirect("/admin/admin-login");
};

module.exports = { authorizationMiddleware, adminAuthorizationMiddleware };
