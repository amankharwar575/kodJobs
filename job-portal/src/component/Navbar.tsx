import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Larger logo */}
          <div className="absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30">
            <img 
              src="/logo.png"
              alt="Logo"
              className="h-10 sm:h-12 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
              onClick={() => navigate('/')}
            />
          </div>

          {/* Navigation buttons container */}
          <div className="w-full flex justify-end">
            <div className="flex items-center gap-2 sm:gap-3">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm sm:text-base"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                    <button
                      onClick={() => navigate('/jobs')}
                      className="px-4 sm:px-6 py-2 sm:py-2.5 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
                    >
                      Jobs
                    </button>
                    <button
                      onClick={logout}
                      className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm sm:text-base"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}