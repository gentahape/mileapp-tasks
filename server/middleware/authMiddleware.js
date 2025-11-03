export const protect = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader != 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    if (bearerToken) {
      req.user = {
        id: 'user-id-mock-123'
      };
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};