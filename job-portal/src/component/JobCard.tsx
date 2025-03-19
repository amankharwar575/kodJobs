// src/components/JobCard.tsx
import { useState } from 'react';
import axiosInstance from '../utils/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Job {
  id: number;
  title: string;
  company: string;
  salary?: string;
  location: string;
  skills: string[];
  posted: string;
  expires?: string;
  link: string;
}

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  isApplied: boolean;
  onSaveToggle: (jobId: number) => void;
  onApplyToggle: (jobId: number) => void;
}

export default function JobCard({ job, isSaved, isApplied, onSaveToggle, onApplyToggle }: JobCardProps) {
  const [saved, setSaved] = useState(isSaved);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(isApplied);
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth();

  // Generate a random LPA value between 2.5 and 6
  const lpa = (Math.random() * 3.5 + 2.5).toFixed(1);
  
  // Generate company logo from first letter of company name
  const companyLogo = job.company.charAt(0).toUpperCase();
  
  // Generate random color for the card header
  const colors = ['#FF6B6B', '#4ECDC4', '#7A77FF', '#FFD166', '#06D6A0'];
  const headerColor = colors[Math.floor(Math.random() * colors.length)];

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save jobs');
      return;
    }

    try {
      if (saved) {
        await axiosInstance.delete(`/saved-jobs`, { data: { job_id: job.id } });
      } else {
        await axiosInstance.post('/saved-jobs', { job_id: job.id });
      }
      
      setSaved(!saved);
      onSaveToggle(job.id);
      toast.success(saved ? 'Job unsaved' : 'Job saved');
    } catch (error) {
      toast.error('Failed to update saved status');
      console.error(error);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply for jobs');
      return;
    }
    
    setApplying(true);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token missing');
        return;
      }
      
      // Call the API to apply for the job
      await axios.post('/api/apply', 
        { jobId: job.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setApplied(true);
      onApplyToggle(job.id);
      toast.success(`Successfully applied for ${job.title} at ${job.company}`);
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  // Animation variants
  const skillVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 h-full flex flex-col"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Colored header bar with animation */}
      <motion.div 
        className="h-2" 
        style={{ backgroundColor: headerColor }}
        animate={{ 
          width: isHovered ? "100%" : "100%",
          height: isHovered ? "4px" : "2px"
        }}
        transition={{ duration: 0.3 }}
      ></motion.div>
      
      <div className="p-4 flex-grow">
        {/* Company and LPA */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <motion.div 
              className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {job.company.includes('Systems') || job.company.includes('Tech') ? (
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random&color=fff`} 
                  alt={job.company}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-gray-700">{companyLogo}</span>
              )}
            </motion.div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">{job.company}</h3>
              <div className="flex items-center text-gray-500 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </div>
            </div>
          </div>
          <motion.div 
            className="text-right"
            whileHover={{ scale: 1.1 }}
          >
            <span className="font-bold text-gray-800">{lpa} LPA</span>
          </motion.div>
        </div>

        {/* Job Title with animation */}
        <motion.h2 
          className="text-lg font-bold text-gray-800 mb-3"
          animate={{ color: isHovered ? headerColor : "#1F2937" }}
          transition={{ duration: 0.3 }}
        >
          {job.title}
        </motion.h2>
        
        {/* Skills with animation */}
          <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 5).map((skill, index) => (
            <motion.span 
                key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              variants={skillVariants}
              whileHover="hover"
              animate={{ 
                backgroundColor: isHovered ? `${headerColor}20` : "#DBEAFE",
                color: isHovered ? headerColor : "#1E40AF"
              }}
              transition={{ delay: index * 0.05 }}
              >
                {skill}
            </motion.span>
            ))}
          </div>

        {/* Posted and Expired */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{job.posted}</span>
        </div>
        
              {job.expires && (
          <div className="flex items-center text-sm text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{job.expires}</span>
          </div>
              )}
            </div>
      
      {/* Application Status and Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 mt-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <motion.button
              onClick={handleSaveJob}
              className="mr-3 text-gray-500 hover:text-blue-600 focus:outline-none"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {saved ? (
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  viewBox="0 0 20 20" 
                  fill="#3B82F6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </motion.svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </motion.button>
            
            <div className="flex items-center text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm">{applied ? "Applied" : "Not Applied"}</span>
            </div>
          </div>

          <motion.button
            onClick={handleApply}
            disabled={applying || applied}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
              applied 
                ? 'bg-green-500 text-white cursor-not-allowed' 
                : applying 
                  ? 'bg-gray-400 text-white cursor-wait' 
                  : 'bg-black text-white hover:bg-gray-800'
            }`}
            whileHover={!applied && !applying ? { scale: 1.05 } : {}}
            whileTap={!applied && !applying ? { scale: 0.95 } : {}}
          >
            {applied ? (
              <>
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </motion.svg>
                Applied
              </>
            ) : applying ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Applying...
              </>
            ) : (
              <>
                Apply Now
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  animate={{ x: isHovered ? [0, 5, 0] : 0 }}
                  transition={{ repeat: isHovered ? Infinity : 0, duration: 1 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </motion.svg>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}