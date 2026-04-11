import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserStats } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FeedbackModal from '../components/FeedbackModal';
import { TrendingUp, Target, AlertCircle, Calendar, LogOut } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getUserStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm md:text-base text-gray-600 mt-2">Track your interview preparation progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Total Attempts</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalAttempts || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
                <Target className="text-blue-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Average Score</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                  {stats?.averageScore?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="bg-green-100 p-2 md:p-3 rounded-lg">
                <TrendingUp className="text-green-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Daily Attempts</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                  {stats?.dailyAttempts || 0}/5
                </p>
              </div>
              <div className="bg-purple-100 p-2 md:p-3 rounded-lg">
                <Calendar className="text-purple-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {stats?.weakAreas && stats.weakAreas.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-yellow-600" size={20} />
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Areas to Improve</h3>
            </div>
            <div className="space-y-3">
              {stats.weakAreas.map((area, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base text-gray-900 break-words line-clamp-2">{area.question}</p>
                    <p className="text-xs md:text-sm text-gray-600">{area.attempts} attempts</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                      area.averageScore >= 70 ? 'bg-green-100 text-green-700' :
                      area.averageScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {area.averageScore.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats?.recentAttempts && stats.recentAttempts.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Recent Attempts</h3>
            <div className="space-y-3">
              {stats.recentAttempts.map((attempt) => (
                <div 
                  key={attempt._id} 
                  onClick={() => setSelectedAttempt(attempt)}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base text-gray-900 break-words line-clamp-2">{attempt.question}</p>
                    <p className="text-xs md:text-sm text-gray-600">
                      {new Date(attempt.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-3 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm font-bold ${
                      attempt.score >= 70 ? 'bg-green-100 text-green-700' :
                      attempt.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {attempt.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedAttempt && (
          <FeedbackModal 
            attempt={selectedAttempt} 
            onClose={() => setSelectedAttempt(null)} 
          />
        )}

        <div className="mt-6 md:mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="w-full md:w-auto bg-black text-white px-6 md:px-8 py-3 rounded-lg text-sm md:text-base font-medium hover:bg-gray-800 transition"
          >
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
