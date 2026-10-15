// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getUserStats } from '../services/api';
// import { useAuth } from '../context/AuthContext';
// import FeedbackModal from '../components/FeedbackModal';
// import { TrendingUp, Target, AlertCircle, Calendar, LogOut } from 'lucide-react';

// const Dashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedAttempt, setSelectedAttempt] = useState(null);
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const response = await getUserStats();
//       setStats(response.data);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">

//       <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
//         <div className="mb-6 md:mb-8">
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h2>
//           <p className="text-sm md:text-base text-gray-600 mt-2">Track your interview preparation progress</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
//           <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-xs md:text-sm">Total Attempts</p>
//                 <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
//                   {stats?.totalAttempts || 0}
//                 </p>
//               </div>
//               <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
//                 <Target className="text-blue-600" size={20} />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-xs md:text-sm">Average Score</p>
//                 <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
//                   {stats?.averageScore?.toFixed(1) || 0}%
//                 </p>
//               </div>
//               <div className="bg-green-100 p-2 md:p-3 rounded-lg">
//                 <TrendingUp className="text-green-600" size={20} />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-xs md:text-sm">Daily Attempts</p>
//                 <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
//                   {stats?.dailyAttempts || 0}/5
//                 </p>
//               </div>
//               <div className="bg-purple-100 p-2 md:p-3 rounded-lg">
//                 <Calendar className="text-purple-600" size={20} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {stats?.weakAreas && stats.weakAreas.length > 0 && (
//           <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 md:mb-8">
//             <div className="flex items-center gap-2 mb-4">
//               <AlertCircle className="text-yellow-600" size={20} />
//               <h3 className="text-lg md:text-xl font-bold text-gray-900">Areas to Improve</h3>
//             </div>
//             <div className="space-y-3">
//               {stats.weakAreas.map((area, index) => (
//                 <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2">
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-sm md:text-base text-gray-900 break-words line-clamp-2">{area.question}</p>
//                     <p className="text-xs md:text-sm text-gray-600">{area.attempts} attempts</p>
//                   </div>
//                   <div className="flex-shrink-0">
//                     <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
//                       area.averageScore >= 70 ? 'bg-green-100 text-green-700' :
//                       area.averageScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
//                       'bg-red-100 text-red-700'
//                     }`}>
//                       {area.averageScore.toFixed(1)}%
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {stats?.recentAttempts && stats.recentAttempts.length > 0 && (
//           <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
//             <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Recent Attempts</h3>
//             <div className="space-y-3">
//               {stats.recentAttempts.map((attempt) => (
//                 <div 
//                   key={attempt._id} 
//                   onClick={() => setSelectedAttempt(attempt)}
//                   className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer gap-2"
//                 >
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-sm md:text-base text-gray-900 break-words line-clamp-2">{attempt.question}</p>
//                     <p className="text-xs md:text-sm text-gray-600">
//                       {new Date(attempt.createdAt).toLocaleDateString('en-US', {
//                         month: 'short',
//                         day: 'numeric',
//                         year: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit'
//                       })}
//                     </p>
//                   </div>
//                   <div className="flex-shrink-0">
//                     <span className={`px-3 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm font-bold ${
//                       attempt.score >= 70 ? 'bg-green-100 text-green-700' :
//                       attempt.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
//                       'bg-red-100 text-red-700'
//                     }`}>
//                       {attempt.score}%
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {selectedAttempt && (
//           <FeedbackModal 
//             attempt={selectedAttempt} 
//             onClose={() => setSelectedAttempt(null)} 
//           />
//         )}

//         <div className="mt-6 md:mt-8 text-center">
//           <button
//             onClick={() => navigate('/')}
//             className="w-full md:w-auto bg-black text-white px-6 md:px-8 py-3 rounded-lg text-sm md:text-base font-medium hover:bg-gray-800 transition"
//           >
//             Start New Interview
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserStats } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FeedbackModal from '../components/FeedbackModal';
import {
  TrendingUp,
  Target,
  AlertCircle,
  Calendar,
  LogOut,
  ArrowRight,
  Sparkles,
  Trophy,
  ChevronRight,
  BarChart3,
  Clock3,
  Brain,
  Play,
} from 'lucide-react';

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
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-2xl bg-slate-200 animate-pulse" />
            <div className="absolute inset-2 rounded-xl bg-slate-950 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white animate-pulse" />
            </div>
          </div>

          <p className="text-sm font-medium text-slate-600">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-48 w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute top-[45%] -left-48 w-[500px] h-[500px] rounded-full bg-violet-100/30 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

        {/* ───────────────── HEADER ───────────────── */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Interview Analytics
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
              Welcome back{user?.name ? `, ${user.name}` : ''}
            </h1>

            <p className="text-sm md:text-base text-slate-500 mt-2">
              Track your interview preparation and improve with every attempt.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="self-start sm:self-auto group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all text-sm font-semibold shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

        </div>

        {/* ───────────────── HERO ───────────────── */}

        <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-8 md:p-10 mb-6 shadow-2xl shadow-slate-300/40">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.28),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.2),transparent_35%)]" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-slate-300 mb-5">
                <Brain className="w-3.5 h-3.5 text-blue-400" />
                Your Interview Workspace
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
                Build confidence.
                <br />
                <span className="text-blue-400">Practice smarter.</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
                Review your performance, identify areas that need attention,
                and continue practicing with focused interview questions.
              </p>

            </div>

            <button
              onClick={() => navigate('/')}
              className="group shrink-0 inline-flex items-center justify-center gap-2 bg-white text-slate-950 px-5 py-3.5 rounded-xl font-semibold hover:bg-slate-100 transition-all shadow-xl text-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Interview
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>
        </div>

        {/* ───────────────── STAT CARDS ───────────────── */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-6">

          {/* Total Attempts */}
          <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">

            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-blue-50 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative flex items-start justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Attempts
                </p>

                <p className="text-3xl md:text-4xl font-bold text-slate-950 mt-3">
                  {stats?.totalAttempts || 0}
                </p>

                <p className="text-xs text-slate-500 mt-2">
                  Interview responses completed
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>

            </div>
          </div>

          {/* Average Score */}
          <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">

            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-emerald-50 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative flex items-start justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Average Score
                </p>

                <p className="text-3xl md:text-4xl font-bold text-slate-950 mt-3">
                  {stats?.averageScore?.toFixed(1) || 0}
                  <span className="text-lg text-slate-400 ml-1">%</span>
                </p>

                <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Overall performance
                </div>
              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>

            </div>
          </div>

          {/* Daily Attempts */}
          <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 sm:col-span-2 lg:col-span-1">

            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-violet-50 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative flex items-start justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Daily Attempts
                </p>

                <p className="text-3xl md:text-4xl font-bold text-slate-950 mt-3">
                  {stats?.dailyAttempts || 0}
                  <span className="text-lg text-slate-400 ml-1">
                    /5
                  </span>
                </p>

                <p className="text-xs text-slate-500 mt-2">
                  Attempts used today
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-violet-600" />
              </div>

            </div>
          </div>

        </div>

        {/* ───────────────── MAIN GRID ───────────────── */}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ───────── WEAK AREAS ───────── */}

          {stats?.weakAreas && stats.weakAreas.length > 0 && (
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

              <div className="px-5 sm:px-6 py-5 border-b border-slate-100">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Areas to Improve
                      </h3>

                      <p className="text-xs text-slate-500 mt-0.5">
                        Focus areas from your attempts
                      </p>
                    </div>

                  </div>

                </div>

              </div>

              <div className="p-4 sm:p-5 space-y-3">

                {stats.weakAreas.map((area, index) => (

                  <div
                    key={index}
                    className="group p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-white hover:shadow-sm transition-all"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex gap-3 min-w-0">

                        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500">
                          {index + 1}
                        </div>

                        <div className="min-w-0">

                          <p className="font-semibold text-sm text-slate-800 break-words line-clamp-2 leading-relaxed">
                            {area.question}
                          </p>

                          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                            <Clock3 className="w-3.5 h-3.5" />
                            {area.attempts} attempts
                          </div>

                        </div>

                      </div>

                      <span
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 ${
                          area.averageScore >= 70
                            ? 'bg-emerald-50 text-emerald-700'
                            : area.averageScore >= 50
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {area.averageScore.toFixed(1)}%
                      </span>

                    </div>

                  </div>

                ))}

              </div>
            </div>
          )}

          {/* ───────── RECENT ATTEMPTS ───────── */}

          {stats?.recentAttempts && stats.recentAttempts.length > 0 && (
            <div
              className={`${
                stats?.weakAreas && stats.weakAreas.length > 0
                  ? 'lg:col-span-3'
                  : 'lg:col-span-5'
              } bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden`}
            >

              <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Recent Attempts
                    </h3>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Your latest interview practice
                    </p>
                  </div>

                </div>

                <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                  View details
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>

              </div>

              <div className="p-4 sm:p-5 space-y-3">

                {stats.recentAttempts.map((attempt) => (

                  <div
                    key={attempt._id}
                    onClick={() => setSelectedAttempt(attempt)}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >

                    {/* Icon */}
                    <div className="hidden sm:flex w-10 h-10 rounded-xl bg-white border border-slate-200 items-center justify-center flex-shrink-0 group-hover:border-blue-200 transition-colors">
                      <MessageIcon score={attempt.score} />
                    </div>

                    {/* Question */}
                    <div className="flex-1 min-w-0">

                      <p className="font-semibold text-sm text-slate-800 break-words line-clamp-2 leading-relaxed group-hover:text-blue-700 transition-colors">
                        {attempt.question}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />

                        {new Date(attempt.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }
                        )}
                      </div>

                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-2 flex-shrink-0">

                      <span
                        className={`px-3 py-2 rounded-xl text-xs font-bold ${
                          attempt.score >= 70
                            ? 'bg-emerald-50 text-emerald-700'
                            : attempt.score >= 50
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {attempt.score}%
                      </span>

                      <ChevronRight className="hidden sm:block w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />

                    </div>

                  </div>

                ))}

              </div>
            </div>
          )}

        </div>

        {/* Feedback Modal */}

        {selectedAttempt && (
          <FeedbackModal
            attempt={selectedAttempt}
            onClose={() => setSelectedAttempt(null)}
          />
        )}

        {/* ───────────────── BOTTOM CTA ───────────────── */}

        <div className="relative overflow-hidden mt-6 md:mt-8 rounded-3xl bg-white border border-slate-200 shadow-sm">

          <div className="absolute right-0 top-0 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-70" />

          <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-white" />
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Keep building your interview confidence
                </h3>

                <p className="text-sm text-slate-500 mt-1 max-w-xl">
                  Start another practice session and continue working on your
                  interview skills.
                </p>
              </div>

            </div>

            <button
              onClick={() => navigate('/')}
              className="group w-full md:w-auto inline-flex items-center justify-center gap-2 bg-slate-950 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-950/15 text-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              Start New Interview
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>
        </div>

        {/* Footer */}

        <div className="text-center mt-8 pb-4">
          <p className="text-xs text-slate-400">
            Practice consistently. Improve one answer at a time.
          </p>
        </div>

      </div>
    </div>
  );
};

/* Small presentational helper only */
const MessageIcon = ({ score }) => {
  if (score >= 70) {
    return <Trophy className="w-4 h-4 text-emerald-600" />;
  }

  if (score >= 50) {
    return <Target className="w-4 h-4 text-amber-600" />;
  }

  return <AlertCircle className="w-4 h-4 text-red-500" />;
};

export default Dashboard;