// src/pages/Jobs.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import JobCard from './JobCard';
import Navbar from './Navbar';
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

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set<number>());
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set<number>());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authentication token missing');
          logout();
          navigate('/login');
          return;
        }

        // Fetch jobs, saved jobs, and applied jobs
        const [jobsRes, savedRes, appliedRes] = await Promise.all([
          axios.get('/api/jobs', {
            headers: { Authorization: `Bearer ${token}` },
            params: { search, location: locationFilter }
          }),
          axios.get('/api/saved-jobs', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/applications', {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: [] })) // Fallback for applications endpoint
        ]);

        // Process job data
        const safeJobs = jobsRes.data.map((job: any) => ({
          ...job,
          salary: job.salary || 'Not disclosed',
          expires: job.expires || 'N/A',
          skills: Array.isArray(job.skills) ? job.skills : [job.skills].filter(Boolean)
        }));
        
        setJobs(safeJobs);
        setSavedJobs(new Set(savedRes.data.map((j: any) => j.job_id)));
        setAppliedJobs(new Set(appliedRes.data));
      } catch (error: any) {
        console.error('Error fetching jobs:', error);
        
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          logout();
          navigate('/login');
        } else {
          toast.error('Failed to load jobs. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, search, locationFilter, navigate, logout]);

  const handleSaveToggle = (jobId: number) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const handleApplyToggle = (jobId: number) => {
    setAppliedJobs(prev => {
      const newSet = new Set(prev);
      newSet.add(jobId);
      return newSet;
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const filterVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <span className="text-blue-500 text-sm font-medium">Loading</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
              <span className="text-blue-600">Discover</span> Your Next Opportunity
            </h1>
            
            <motion.button
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </motion.button>
          </div>
          
          <motion.div
            className="overflow-hidden"
            initial="hidden"
            animate={showFilters ? "visible" : "hidden"}
            variants={filterVariants}
          >
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Jobs</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <motion.input
                      id="search"
            type="text"
                      placeholder="Search by title, skills, or company..."
                      className="pl-10 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
                      whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)" }}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <motion.input
                      id="location"
            type="text"
                      placeholder="Filter by city, state, or country..."
                      className="pl-10 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
                      whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)" }}
          />
        </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {jobs.length === 0 ? (
          <motion.div 
            className="bg-white rounded-lg shadow-md p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h2>
            <p className="text-gray-500 mb-4">Try adjusting your search filters</p>
            <motion.button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => {
                setSearch('');
                setLocationFilter('');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Filters
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
            <JobCard
              job={job}
              isSaved={savedJobs.has(job.id)}
                  isApplied={appliedJobs.has(job.id)}
              onSaveToggle={handleSaveToggle}
                  onApplyToggle={handleApplyToggle}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Floating action button */}
        <motion.div
          className="fixed bottom-6 right-6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200, damping: 10 }}
        >
          <motion.button
            className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
            whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}