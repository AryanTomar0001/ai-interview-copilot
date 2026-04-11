import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-14 md:h-16">
          <h1 className="text-base md:text-lg lg:text-xl font-bold truncate">AI Interview Copilot</h1>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-xs md:text-sm text-gray-700 hidden sm:inline truncate max-w-[120px] md:max-w-none">Welcome, {user?.name}</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700 hover:text-black transition"
            >
              <LayoutDashboard size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700 hover:text-black transition"
            >
              <LogOut size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
