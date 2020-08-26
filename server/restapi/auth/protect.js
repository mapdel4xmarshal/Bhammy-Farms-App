module.exports = () => (req, res, next) => {
  if (req.user) { return next(); }
  res.status(401).json({
    status: 401,
    message: 'Authentication required'
  });
};
