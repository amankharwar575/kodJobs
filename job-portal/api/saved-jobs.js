// Saved Jobs API for Vercel
const jwt = require('jsonwebtoken');

// Secret key for JWT
const SECRET_KEY = 'your-secret-key-here';

// Our saved jobs data
const savedJobs = [];

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

  // Verify JWT token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization required' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.userId;
    
    // GET - Retrieve saved jobs for a user
    if (req.method === 'GET') {
      const userSavedJobs = savedJobs.filter(saved => saved.userId === userId);
      return res.status(200).json(userSavedJobs.map(job => job.jobId));
    }
    
    // POST - Save a job
    if (req.method === 'POST') {
      const { job_id } = req.body;
      
      if (!job_id) {
        return res.status(400).json({ message: 'Job ID is required' });
      }
      
      // Check if already saved
      const existingSaved = savedJobs.find(
        saved => saved.userId === userId && saved.jobId === job_id
      );
      
      if (existingSaved) {
        return res.status(400).json({ message: 'Job already saved' });
      }
      
      // Add saved job
      const savedJob = {
        id: savedJobs.length + 1,
        userId,
        jobId: job_id,
        savedAt: new Date().toISOString()
      };
      
      savedJobs.push(savedJob);
      
      return res.status(201).json({
        message: 'Job saved successfully',
        savedJobId: savedJob.id
      });
    }
    
    // DELETE - Unsave a job
    if (req.method === 'DELETE') {
      const { job_id } = req.body;
      
      if (!job_id) {
        return res.status(400).json({ message: 'Job ID is required' });
      }
      
      // Find saved job index
      const savedJobIndex = savedJobs.findIndex(
        saved => saved.userId === userId && saved.jobId === job_id
      );
      
      if (savedJobIndex === -1) {
        return res.status(404).json({ message: 'Saved job not found' });
      }
      
      // Remove saved job
      savedJobs.splice(savedJobIndex, 1);
      
      return res.status(200).json({
        message: 'Job unsaved successfully'
      });
    }
    
    // Method not allowed for any other HTTP methods
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}; 