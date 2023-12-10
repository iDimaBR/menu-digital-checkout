const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, redirect: "/", message: 'Token não fornecido ou formato inválido' });
  }

  const tokenString = token.replace('Bearer ', '');

  jwt.verify(tokenString, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, redirect: "/", message: 'Token inválido' });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
