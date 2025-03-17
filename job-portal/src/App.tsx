import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import { Toaster } from 'react-hot-toast'
import Login from './component/Login'
import Register from './component/Register'
import Jobs from './component/Jobs'
import Footer from './component/Footer'
import CustomCursor from './component/CustomCursor'
import ThemeProvider from './ThemeContext'
import ThemeToggle from './component/ThemeToggle'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <CustomCursor />
          <ThemeToggle />
          <Toaster position="top-right" />
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/jobs" element={<Jobs />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App