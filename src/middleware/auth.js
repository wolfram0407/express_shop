function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/products");
  }
  next();
}

function checkAdmin(req,res,next){
  if(req.isAuthenticated() && res.locals.currentUser.admin ==1){
    next()
  }else{
    req.flash('error', '관리자가 아닙니다')
    res.redirect('/login')
  }
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  checkAdmin,
};
