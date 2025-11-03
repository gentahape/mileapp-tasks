import crypto from 'crypto';

export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const userId = crypto.randomBytes(12).toString('hex');
  const token = crypto.randomBytes(32).toString('hex');

  const mockUser = {
    id: userId,
    name: email.split('@')[0],
    email: email
  };

  res.status(200).json({ 
    message: "Login Successful",
    token: token, 
    user: mockUser 
  });
}