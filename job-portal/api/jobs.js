// Jobs API for Vercel
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

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Our jobs data
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp Systems",
      salary: "₹8-12 LPA",
      location: "Bangalore",
      skills: ["React", "JavaScript", "HTML", "CSS", "TypeScript"],
      posted: "Posted 2 days ago",
      expires: "Expires in 28 days",
      link: "https://example.com/job/1"
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "CloudSoft Technologies",
      salary: "₹10-15 LPA",
      location: "Hyderabad",
      skills: ["Node.js", "Express", "MongoDB", "AWS", "Docker"],
      posted: "Posted 1 week ago",
      expires: "Expires in 21 days",
      link: "https://example.com/job/2"
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "InnovateTech Solutions",
      salary: "₹12-18 LPA",
      location: "Pune",
      skills: ["React", "Node.js", "PostgreSQL", "TypeScript", "Redux"],
      posted: "Posted 3 days ago",
      link: "https://example.com/job/3"
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "CloudSoft Technologies",
      salary: "₹14-20 LPA",
      location: "Bangalore",
      skills: ["AWS", "Kubernetes", "Docker", "CI/CD", "Terraform"],
      posted: "Posted 5 days ago",
      expires: "Expires in 25 days",
      link: "https://example.com/job/4"
    },
    {
      id: 5,
      title: "UI/UX Designer",
      company: "DesignHub Creative",
      salary: "₹6-10 LPA",
      location: "Mumbai",
      skills: ["Figma", "Adobe XD", "Sketch", "UI Design", "UX Research"],
      posted: "Posted 1 day ago",
      link: "https://example.com/job/5"
    },
    {
      id: 6,
      title: "Data Scientist",
      company: "DataMinds Analytics",
      salary: "₹15-22 LPA",
      location: "Delhi",
      skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "SQL"],
      posted: "Posted 2 weeks ago",
      expires: "Expires in 14 days",
      link: "https://example.com/job/6"
    },
    {
      id: 7,
      title: "Mobile Developer (Android)",
      company: "AppCreators Tech",
      salary: "₹8-14 LPA",
      location: "Chennai",
      skills: ["Java", "Kotlin", "Android SDK", "Firebase", "RESTful APIs"],
      posted: "Posted 4 days ago",
      link: "https://example.com/job/7"
    },
    {
      id: 8,
      title: "Mobile Developer (iOS)",
      company: "AppCreators Tech",
      salary: "₹8-14 LPA",
      location: "Chennai",
      skills: ["Swift", "Objective-C", "iOS SDK", "Core Data", "SwiftUI"],
      posted: "Posted 4 days ago",
      link: "https://example.com/job/8"
    },
    {
      id: 9,
      title: "Project Manager",
      company: "TechCorp Systems",
      salary: "₹16-25 LPA",
      location: "Bangalore",
      skills: ["Agile", "Scrum", "JIRA", "Risk Management", "Stakeholder Management"],
      posted: "Posted 1 week ago",
      expires: "Expires in 21 days",
      link: "https://example.com/job/9"
    },
    {
      id: 10,
      title: "QA Engineer",
      company: "QualityFirst Solutions",
      salary: "₹5-9 LPA",
      location: "Pune",
      skills: ["Selenium", "TestNG", "JIRA", "API Testing", "Automated Testing"],
      posted: "Posted 3 days ago",
      link: "https://example.com/job/10"
    }
  ];

  // Return all jobs
  res.status(200).json(jobs);
}; 