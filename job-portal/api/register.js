// Register API for Vercel
const jwt = require('jsonwebtoken');

// Secret key for JWT
const SECRET_KEY = 'your-secret-key-here';

// Our users data - in a real app this would be a database
const users = [
  {
    id: 1,
    username: "user",
    email: "user@example.com",
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

// Variable to keep track of new user IDs
let nextId = users.length + 1;

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

  const { username, email, password, dob, category } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  // Check if user already exists
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  if (users.some(user => user.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  // Create new user
  const newUser = {
    id: nextId++,
    username,
    email,
    password, // In a real app, this should be hashed
    dob: dob || '',
    category: category || ''
  };

  // Add to "database"
  users.push(newUser);

  // Generate token so they can be logged in right away
  const token = jwt.sign(
    { userId: newUser.id, username: newUser.username },
    SECRET_KEY,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    message: 'Registration successful',
    userId: newUser.id,
    token
  });
}; 