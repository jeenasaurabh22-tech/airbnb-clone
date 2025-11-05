exports.getError=(req, res, next) => {
  res.status(404).render('404', {pageTitle: 'Page Not Found',currPage:'404',isLoggedIn:req.isLoggedIn,User:req.session.User});
}