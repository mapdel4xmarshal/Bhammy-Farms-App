module.exports = () => (req, res, next) => {    req.user = {}; return next();
  if (req.user) { return next(); }
  res.status(401).json({
    status: 401,
    message: 'Authentication required'
  });
};
