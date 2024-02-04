const jwt = require('jsonwebtoken');

const JWTauth = (req, res, next) => {
  const token = req.header('Authorization')

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Token is missing.' });
  }


  jwt.verify(token, 'thisIsSecret', (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Unauthorized. Token has expired.' });
      }
      return res.status(403).json({ message: 'Forbidden. Invalid token.' });
    }


    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden. Admin access required.' });
  }
};

module.exports = { JWTauth, isAdmin };
