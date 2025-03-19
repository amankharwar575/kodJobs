// Login API for Vercel
const jwt = require('jsonwebtoken');

// Secret key for JWT (should be in environment variables in production)
const SECRET_KEY = 'your-secret-key-here';

// Our users data - in a real app this would be a database
const defaultUsers = [
  {
    id: 1,
    username: "user",
    email: "user@example.com",
    // This is just a demo password - normally would be properly hashed
    password: "password", 
    dob: "1990-01-01",
    category: "professional"
  },
  {
    id: 2,
    username: "john",
    email: "john@example.com",
    password: "john123", 
    dob: "1995-05-15",
    category: "student"
  },
  {
    id: 3,
    username: "admin",
    email: "admin@example.com",
    password: "admin123", 
    dob: "1985-10-20",
    category: "professional"
  }
];

// Use global variable to store registered users across function invocations
// Note: This is just for demo purposes - in production, use a database
global.registeredUsers = global.registeredUsers || [];

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Combine default users with registered users
  const allUsers = [...defaultUsers, ...global.registeredUsers];

  // Find user
  const user = allUsers.find(u => 
    (u.username === username && u.password === password) ||
    (u.email === username && u.password === password)
  );
  
  // Verify credentials
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: '24h' }
  );

  res.status(200).json({
    message: 'Login successful',
    token,
    userId: user.id,
    username: user.username
  });
}; 