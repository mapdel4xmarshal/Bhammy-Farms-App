module.exports = (options = {}) => (req, res, next) => {
  if (process.env.NODE_ENV !== 'production' || req.path === options.skip) {
    req.user = {};
    return next();
  }
  console.log('user---', req.user);
  if (req.user) { return next(); }
  res.status(401).json({
    status: 401,
    message: 'Authentication required'
  });
};
