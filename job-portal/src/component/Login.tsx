// src/component/Login.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [animateGrid, setAnimateGrid] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Start grid animation after component mounts
    const timer = setTimeout(() => {
      setAnimateGrid(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post('/api/login', {
        username,
        password
      });
      
      const { token, userId, username: user } = response.data;
      
      login(token, userId);
      toast.success(`Welcome back, ${user}!`);
      navigate('/jobs');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 0.2,
      transition: { 
        staggerChildren: 0.03,
        delayChildren: 0.2
      }
    }
  };
  
  const cellVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  const logoVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  
  const headingVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  const subHeadingVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const paragraphVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: 0.7,
        ease: "easeOut"
      }
    }
  };
  
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
        delay: 0.3 + (custom * 0.1),
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex flex-col md:flex-row flex-grow">
        {/* Left side - Hero section (70%) */}
        <div className="w-full md:w-[70%] bg-gray-900 text-white p-8 flex flex-col justify-center items-center relative overflow-hidden">
          {/* Grid background with animation */}
          <motion.div 
            className="absolute inset-0 grid grid-cols-12 grid-rows-12"
            variants={gridVariants}
            initial="hidden"
            animate={animateGrid ? "visible" : "hidden"}
          >
            {Array.from({ length: 13 }).map((_, rowIndex) => (
              Array.from({ length: 13 }).map((_, colIndex) => (
                <motion.div 
                  key={`${rowIndex}-${colIndex}`}
                  className="border border-gray-600"
                  variants={cellVariants}
                  custom={(rowIndex * 13) + colIndex}
                />
              ))
            ))}
          </motion.div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-blue-500"
                style={{
                  width: Math.random() * 6 + 2,
                  height: Math.random() * 6 + 2,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * -100 - 50],
                  x: [0, Math.random() * 50 - 25],
                  opacity: [0, 0.7, 0]
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear"
                }}
              />
            ))}
          </div>
          
          {/* Logo with animation */}
          <motion.div 
            className="absolute top-8 left-8"
            variants={logoVariants}
            initial="initial"
            animate="animate"
          >
            <img src="/images/kodnextjob-logo.svg" alt="KodNextJob" className="h-16" />
          </motion.div>
          
          {/* Main content with animations */}
          <div className="max-w-3xl text-center z-10 mt-16">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
              variants={headingVariants}
              initial="initial"
              animate="animate"
            >
              Find Your Dream Job
            </motion.h1>
            
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-8"
              variants={subHeadingVariants}
              initial="initial"
              animate="animate"
            >
              and get <img src="/images/kodnextjob-logo.svg" alt="KodNextJob" className="h-12 inline-block" />
            </motion.h2>
            
            <motion.p
              className="text-xl text-gray-300 max-w-2xl mx-auto"
              variants={paragraphVariants}
              initial="initial"
              animate="animate"
            >
              Explore thousands of job listings or find the perfect candidate
            </motion.p>
            
            {/* Pulse animation for call-to-action */}
            <motion.div
              className="mt-8 inline-block"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 0 0 rgba(59, 130, 246, 0)",
                  "0 0 0 10px rgba(59, 130, 246, 0.3)",
                  "0 0 0 0 rgba(59, 130, 246, 0)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            >
              <motion.button
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/register')}
              >
                Get Started
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Right side - Login form (30%) */}
        <div className="w-full md:w-[30%] flex items-center justify-center p-8 relative overflow-hidden">
          {/* Floating bubbles in the login section */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
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
            className="w-full max-w-md z-10 bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg"
            variants={formVariants}
            initial="initial"
            animate="animate"
          >
            <div className="text-center mb-8">
              <motion.h2 
                className="text-3xl font-bold text-gray-800"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Job Portal
              </motion.h2>
              <motion.p 
                className="text-gray-600 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Sign in to your account
              </motion.p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                variants={inputVariants}
                initial="initial"
                animate="animate"
                whileFocus="focus"
                custom={0}
              >
                <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                  Username
                </label>
                <motion.input
                  type="text"
                  id="username"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <motion.input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>
              
              <motion.button
                type="submit"
                className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading}
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </motion.button>
            </form>
            
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <p className="text-gray-600">
                Don't have an account?{' '}
                <motion.span
                  whileHover={{ color: "#1E40AF" }}
                >
                  <Link to="/register" className="text-blue-600 hover:underline">
                    Register
                  </Link>
                </motion.span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}