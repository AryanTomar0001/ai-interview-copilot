// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Loader2 } from 'lucide-react';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       await login(email, password);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="max-w-md w-full">
//         <div className="bg-white rounded-xl shadow-md p-8">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
//             <p className="text-gray-600 mt-2">Sign in to your account</p>
//           </div>

//           {error && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
//                 placeholder="you@example.com"
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
//                 placeholder="••••••••"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="animate-spin mr-2" size={20} />
//                   Signing in...
//                 </>
//               ) : (
//                 'Sign In'
//               )}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-gray-600">
//               Don't have an account?{' '}
//               <Link to="/signup" className="text-black font-medium hover:underline">
//                 Sign up
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  BrainCircuit,
  ShieldCheck,
  Mic2,
  BarChart3,
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[550px] h-[550px] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute -bottom-56 -right-40 w-[600px] h-[600px] rounded-full bg-violet-100/40 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 w-[350px] h-[350px] rounded-full bg-cyan-100/20 blur-3xl" />
      </div>

      <div className="relative min-h-screen flex">

        {/* LEFT — Product branding */}
        <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] bg-slate-950 relative overflow-hidden">

          {/* Decorative gradients */}
          <div className="absolute inset-0">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute bottom-[-180px] right-[-100px] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col justify-between w-full p-10 xl:p-14">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                <BrainCircuit className="w-6 h-6 text-blue-400" />
              </div>

              <div>
                <p className="text-white font-bold text-base">
                  AI Interview Copilot
                </p>
                <p className="text-slate-500 text-xs">
                  Interview preparation platform
                </p>
              </div>
            </div>

            {/* Main content */}
            <div className="max-w-xl">

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-blue-300 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Interview Practice
              </div>

              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.08] tracking-tight">
                Practice smarter.
                <span className="block text-blue-400 mt-1">
                  Interview better.
                </span>
              </h1>

              <p className="mt-6 text-slate-400 text-base xl:text-lg leading-relaxed max-w-lg">
                Prepare with resume-based questions, practice your answers,
                and understand where you can improve.
              </p>

              {/* Product capabilities */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10">

                <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                  <Mic2 className="w-5 h-5 text-blue-400 mb-3" />
                  <p className="text-white text-sm font-semibold">
                    Voice Practice
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Answer naturally
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                  <BrainCircuit className="w-5 h-5 text-violet-400 mb-3" />
                  <p className="text-white text-sm font-semibold">
                    AI Analysis
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Understand answers
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                  <BarChart3 className="w-5 h-5 text-emerald-400 mb-3" />
                  <p className="text-white text-sm font-semibold">
                    Track Progress
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Improve over time
                  </p>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              AI Interview Copilot
              <span className="text-slate-700">•</span>
              Built for interview preparation
            </div>

          </div>
        </div>

        {/* RIGHT — Login */}
        <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">

          <div className="w-full max-w-md">

            {/* Mobile brand */}
            <div className="flex lg:hidden items-center justify-center gap-3 mb-10">
              <div className="w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg">
                <BrainCircuit className="w-6 h-6 text-blue-400" />
              </div>

              <div>
                <p className="font-bold text-slate-950">
                  AI Interview Copilot
                </p>
                <p className="text-xs text-slate-400">
                  Interview preparation platform
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                Welcome back
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                Sign in to continue
              </h2>

              <p className="text-sm sm:text-base text-slate-500 mt-3">
                Continue your interview preparation journey.
              </p>
            </div>

            {/* Login card */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">

              {/* Error */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-sm font-bold">
                        !
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-red-800">
                        Sign in failed
                      </p>

                      <p className="text-xs sm:text-sm text-red-700 mt-0.5 break-words">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-800 mb-2"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-800 mb-2"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />

                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`group w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    loading
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-950 text-white hover:bg-slate-800 shadow-lg shadow-slate-950/15 hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2
                        className="animate-spin"
                        size={19}
                      />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-7">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  New here?
                </span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              {/* Signup */}
              <Link
                to="/signup"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-slate-200 text-slate-800 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                Create an account
                <ArrowRight className="w-4 h-4" />
              </Link>

            </div>

            {/* Bottom trust-style UI */}
            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sign in to access your interview workspace</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;