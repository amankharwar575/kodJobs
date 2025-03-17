import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import { toast, Toaster } from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    dob: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast.success('Registration successful');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  
  // Animation variants
  const formVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  
  const inputVariants = {
    initial: { opacity: 0, y: 10 },
    animate: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2 + (custom * 0.1),
        ease: "easeOut"
      }
    }),
    focus: { 
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
      transition: { duration: 0.3 }
    }
  };
  
  const buttonVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: 0.6,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.05,
      backgroundColor: "#1E40AF",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toaster position="top-right" />
      <div className="min-h-screen flex flex-col md:flex-row register-container">
        {/* Left side - Job Portal Image (60%) */}
        <div className="w-full md:w-3/5 relative overflow-hidden bg-yellow-300 flex items-center justify-center register-image">
          <img 
            src="/images/job-banner.svg" 
            alt="Find your dream job" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side - Registration Form (40%) */}
        <div className="w-full md:w-2/5 flex items-center justify-center p-4 sm:p-8 bg-white register-form relative overflow-hidden">
          {/* Floating bubbles in the registration form section */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={`bubble-${i}`}
                className="absolute rounded-full bg-gradient-to-br from-blue-300 to-blue-500"
                style={{
                  width: Math.random() * 20 + 10,
                  height: Math.random() * 20 + 10,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.1 + Math.random() * 0.2,
                  filter: "blur(1px)"
                }}
                animate={{
                  y: [0, Math.random() * -200 - 50],
                  x: [0, Math.random() * 50 - 25],
                  scale: [1, Math.random() * 0.5 + 0.8],
                  opacity: [0.1 + Math.random() * 0.2, 0]
                }}
                transition={{
                  duration: Math.random() * 10 + 15,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear"
                }}
              />
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md space-y-6 z-10 bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg"
          >
            {/* Header */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-900">
                Create Account
              </h2>
              <p className="mt-2 text-gray-600">
                Join thousands finding their dream jobs
              </p>
            </motion.div>

            {/* Form Fields - Stacked vertically */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                variants={inputVariants}
                initial="initial"
                animate="animate"
                whileFocus="focus"
                custom={0}
              >
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <motion.input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>
              
              <motion.div
                variants={inputVariants}
                initial="initial"
                animate="animate"
                whileFocus="focus"
                custom={1}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <motion.input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="initial"
                animate="animate"
                whileFocus="focus"
                custom={2}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <motion.input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="initial"
                animate="animate"
                whileFocus="focus"
                custom={3}
              >
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <motion.input
                  id="dob"
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="initial"
                animate="animate"
                whileFocus="focus"
                custom={4}
              >
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <motion.select
                  id="category"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  whileFocus={{ scale: 1.01 }}
                >
                  <option value="">Select Category</option>
                  <option value="student">Student</option>
                  <option value="professional">Professional</option>
                  <option value="other">Other</option>
                </motion.select>
              </motion.div>

              <motion.div 
                className="pt-2"
                variants={buttonVariants}
                initial="initial"
                animate="animate"
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </motion.button>
              </motion.div>
            </form>

            {/* Login Link */}
            <motion.div 
              className="text-center pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <p className="text-gray-600">
                Already have an account?{' '}
                <motion.span
                  whileHover={{ color: "#1E40AF" }}
                >
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Login
                  </button>
                </motion.span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}