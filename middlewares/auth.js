function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  // Check if request is an API request or expects JSON
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized, silakan login terlebih dahulu'
    });
  }

  // Otherwise redirect to login page
  return res.redirect('/login?error=Silakan login terlebih dahulu');
}

function redirectIfAuth(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect('/admin/dashboard');
  }
  next();
}

module.exports = {
  requireAuth,
  redirectIfAuth
};
