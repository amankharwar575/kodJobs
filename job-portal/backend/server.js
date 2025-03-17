app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const auth = await authenticateUser(email, password);
    res.json(auth);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: error.message || 'Authentication failed' });
  }
});