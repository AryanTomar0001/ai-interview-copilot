import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Brain, Menu, X, LogOut, LayoutDashboard, Info } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const username = localStorage.getItem('username') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/about', label: 'About', icon: <Info className="w-4 h-4" /> }
  ];

  return (
    <header className="flex justify-between items-center px-4 md:px-6 py-3 border-b bg-white shadow-sm sticky top-0 z-50">
      {/* Logo / Title */}
      <div 
        className="flex items-center gap-2 text-lg md:text-xl font-bold cursor-pointer hover:text-blue-600 transition-colors"
        onClick={() => navigate('/')}
      >
        <Brain className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
        <span className="hidden sm:inline">AI Interview Copilot</span>
        <span className="sm:hidden">AI Copilot</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <span className="text-sm text-gray-600">
          Welcome, <span className="font-semibold text-gray-900">{username}</span>
        </span>
        
        {navItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`
              flex items-center gap-1.5
              text-sm md:text-base
              cursor-pointer
              transition-colors
              ${isActive(item.path) 
                ? 'font-semibold text-black underline underline-offset-4' 
                : 'text-gray-700 hover:text-black'
              }
            `}
          >
            {item.icon}
            {item.label}
          </div>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm md:text-base text-red-500 hover:text-red-700 cursor-pointer transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg md:hidden">
          <nav className="flex flex-col p-4 gap-3">
            <div className="pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold text-gray-900">{username}</span>
              </span>
            </div>

            {navItems.map((item) => (
              <div
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`
                  flex items-center gap-2
                  text-base
                  cursor-pointer
                  py-2 px-3
                  rounded-lg
                  transition-colors
                  ${isActive(item.path) 
                    ? 'font-semibold text-black bg-blue-50 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {item.icon}
                {item.label}
              </div>
            ))}

            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-base text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer transition-colors font-medium py-2 px-3 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
