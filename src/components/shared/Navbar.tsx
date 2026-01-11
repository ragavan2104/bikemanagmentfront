import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
                {user?.role === UserRole.ADMIN ? '🛡️ Admin' : '👷 Worker'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 truncate max-w-32 sm:max-w-none">{user?.email}</p>
            </div>
          </div>

          {/* Desktop Navigation - Worker */}
          {user?.role === UserRole.WORKER && (
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate('/worker')}
                className={`px-3 py-2 rounded-lg font-medium transition text-sm ${
                  isActive('/worker')
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                    : 'text-gray-600 hover:text-blue-800 hover:bg-blue-50'
                }`}
              >
                🏠 Dashboard
              </button>
              <button
                onClick={() => navigate('/inventory')}
                className={`px-3 py-2 rounded-lg font-medium transition text-sm ${
                  isActive('/inventory') && !location.search
                    ? 'bg-green-100 text-green-800 border-2 border-green-200'
                    : 'text-gray-600 hover:text-green-800 hover:bg-green-50'
                }`}
              >
                ➕ Add Bike
              </button>
              <button
                onClick={() => navigate('/inventory?status=available')}
                className={`px-3 py-2 rounded-lg font-medium transition text-sm ${
                  location.search.includes('status=available')
                    ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-200'
                    : 'text-gray-600 hover:text-yellow-800 hover:bg-yellow-50'
                }`}
              >
                ✅ Available
              </button>
              <button
                onClick={() => navigate('/inventory?status=sold')}
                className={`px-3 py-2 rounded-lg font-medium transition text-sm ${
                  location.search.includes('status=sold')
                    ? 'bg-gray-100 text-gray-800 border-2 border-gray-200'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                💰 Sold
              </button>
            </div>
          )}

          {/* Desktop Logout Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 text-sm"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            {user?.role === UserRole.WORKER && (
              <>
                <button
                  onClick={() => {
                    navigate('/worker');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/worker')
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:text-blue-800 hover:bg-blue-50'
                  }`}
                >
                  🏠 Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate('/inventory');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/inventory') && !location.search
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:text-green-800 hover:bg-green-50'
                  }`}
                >
                  ➕ Add New Bike
                </button>
                <button
                  onClick={() => {
                    navigate('/inventory?status=available');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    location.search.includes('status=available')
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'text-gray-600 hover:text-yellow-800 hover:bg-yellow-50'
                  }`}
                >
                  ✅ Available Bikes
                </button>
                <button
                  onClick={() => {
                    navigate('/inventory?status=sold');
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    location.search.includes('status=sold')
                      ? 'bg-gray-100 text-gray-800'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  💰 Sold Bikes
                </button>
                <hr className="my-2 border-gray-200" />
              </>
            )}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
