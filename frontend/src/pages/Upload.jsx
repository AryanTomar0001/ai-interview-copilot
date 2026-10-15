// import { useState, useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Upload as UploadIcon, FileText, CheckCircle } from "lucide-react";
// import API, { checkResumeLimit, incrementResumeUpload } from "../services/api";
// import { AppContext } from "../context/AppContext";


// function Upload() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [dragActive, setDragActive] = useState(false);
//   const [limitInfo, setLimitInfo] = useState(null);
//   const navigate = useNavigate();
//   const { setResumeUploaded, resetState } = useContext(AppContext);

//   useEffect(() => {
//     resetState();
//     checkLimit();
//   }, []);

//   const checkLimit = async () => {
//     try {
//       const response = await checkResumeLimit();
//       setLimitInfo(response);
//       if (!response.canProceed) {
//         setError(`Daily resume upload limit reached (${response.limit}). Try again tomorrow.`);
//       }
//     } catch (err) {
//       console.error('Error checking limit:', err);
//     }
//   };

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const droppedFile = e.dataTransfer.files[0];
//       if (droppedFile.type === "application/pdf") {
//         setFile(droppedFile);
//         setError("");
//       } else {
//         setError("Please upload a PDF file");
//       }
//     }
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const selectedFile = e.target.files[0];
//       if (selectedFile.type === "application/pdf") {
//         setFile(selectedFile);
//         setError("");
//       } else {
//         setError("Please upload a PDF file");
//       }
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setError("Please select a file first");
//       return;
//     }

//     if (limitInfo && !limitInfo.canProceed) {
//       setError(`Daily resume upload limit reached (${limitInfo.limit}). Try again tomorrow.`);
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const limitCheck = await checkResumeLimit();
      
//       if (!limitCheck.canProceed) {
//         setError(`Daily resume upload limit reached (${limitCheck.limit}). Try again tomorrow.`);
//         setLoading(false);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("file", file);

//       await API.post("/resume/upload", formData);
      
//       await incrementResumeUpload();
//       await checkLimit();
      
//       setResumeUploaded(true);
//       navigate("/questions");
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to upload resume. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 w-full">
//           <div className="text-center mb-6 md:mb-8">
//             <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
//               AI Interview Copilot
//             </h1>
//             <p className="text-sm md:text-base text-gray-600 break-words whitespace-normal">
//               Upload your resume to get started with personalized interview questions
//             </p>
//             {limitInfo && (
//               <p className="text-xs md:text-sm text-gray-500 mt-2">
//                 Resume uploads today: {limitInfo.used}/{limitInfo.limit}
//               </p>
//             )}
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-4">
//             <div
//               className={`border-2 border-dashed rounded-xl p-6 md:p-12 text-center transition-all ${
//                 dragActive
//                   ? "border-blue-500 bg-blue-50"
//                   : "border-gray-300 hover:border-gray-400"
//               }`}
//               onDragEnter={handleDrag}
//               onDragLeave={handleDrag}
//               onDragOver={handleDrag}
//               onDrop={handleDrop}
//             >
//               {!file ? (
//                 <>
//                   <UploadIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-400 mb-4" />
//                   <p className="text-base md:text-lg font-semibold text-gray-700 mb-2">
//                     Drag and drop your resume here
//                   </p>
//                   <p className="text-xs md:text-sm text-gray-500 mb-4">or</p>
//                   <label className="inline-block">
//                     <input
//                       type="file"
//                       accept=".pdf"
//                       onChange={handleFileChange}
//                       className="hidden"
//                     />
//                     <span className="bg-black text-white px-4 py-2 md:px-6 md:py-3 rounded-lg cursor-pointer hover:bg-gray-800 transition text-sm md:text-base inline-block">
//                       Browse Files
//                     </span>
//                   </label>
//                   <p className="text-xs text-gray-400 mt-4">PDF files only</p>
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle className="w-12 h-12 md:w-16 md:h-16 mx-auto text-green-500 mb-4" />
//                   <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-4">
//                     <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
//                     <p className="text-sm md:text-lg font-semibold text-gray-700 break-words whitespace-normal text-center">
//                       {file.name}
//                     </p>
//                   </div>
//                   <p className="text-xs md:text-sm text-gray-500 mb-4">
//                     {(file.size / 1024).toFixed(2)} KB
//                   </p>
//                   <button
//                     onClick={() => setFile(null)}
//                     className="text-red-500 hover:text-red-700 text-xs md:text-sm font-medium"
//                   >
//                     Remove
//                   </button>
//                 </>
//               )}
//             </div>

//             {error && (
//               <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-red-600 text-xs md:text-sm break-words whitespace-normal">{error}</p>
//               </div>
//             )}

//             <button
//               onClick={handleUpload}
//               disabled={!file || loading}
//               className="w-full mt-4 md:mt-6 bg-black text-white py-2 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Uploading...
//                 </span>
//               ) : (
//                 "Upload & Continue"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Upload;

import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload as UploadIcon,
  FileText,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  X,
  FileCheck2,
  Brain,
  Zap,
  AlertCircle,
} from "lucide-react";
import API, { checkResumeLimit, incrementResumeUpload } from "../services/api";
import { AppContext } from "../context/AppContext";

function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [limitInfo, setLimitInfo] = useState(null);
  const navigate = useNavigate();
  const { setResumeUploaded, resetState } = useContext(AppContext);

  useEffect(() => {
    resetState();
    checkLimit();
  }, []);

  const checkLimit = async () => {
    try {
      const response = await checkResumeLimit();
      setLimitInfo(response);
      if (!response.canProceed) {
        setError(`Daily resume upload limit reached (${response.limit}). Try again tomorrow.`);
      }
    } catch (err) {
      console.error('Error checking limit:', err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError("");
      } else {
        setError("Please upload a PDF file");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload a PDF file");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    if (limitInfo && !limitInfo.canProceed) {
      setError(`Daily resume upload limit reached (${limitInfo.limit}). Try again tomorrow.`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const limitCheck = await checkResumeLimit();
      
      if (!limitCheck.canProceed) {
        setError(`Daily resume upload limit reached (${limitCheck.limit}). Try again tomorrow.`);
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      await API.post("/resume/upload", formData);
      
      await incrementResumeUpload();
      await checkLimit();
      
      setResumeUploaded(true);
      navigate("/questions");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-48 w-[550px] h-[550px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute top-[45%] -left-48 w-[500px] h-[500px] rounded-full bg-violet-100/30 blur-3xl" />
        <div className="absolute bottom-[-250px] right-[20%] w-[450px] h-[450px] rounded-full bg-cyan-100/20 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* ───────────────── TOP BRAND ───────────────── */}

        <div className="flex items-center justify-between mb-10">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg shadow-slate-950/10">
              <Brain className="w-5 h-5 text-white" />
            </div>

            <div>
              <p className="font-bold text-slate-950 text-sm sm:text-base">
                AI Interview Copilot
              </p>
              <p className="text-[11px] sm:text-xs text-slate-400">
                AI-powered interview practice
              </p>
            </div>

          </div>

          {limitInfo && (
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-500" />

              <span className="text-xs font-medium text-slate-500">
                Uploads today
              </span>

              <span className="text-xs font-bold text-slate-900">
                {limitInfo.used}/{limitInfo.limit}
              </span>
            </div>
          )}

        </div>

        {/* ───────────────── HERO ───────────────── */}

        <div className="text-center max-w-3xl mx-auto mb-9">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Personalized Interview Preparation
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950 leading-tight">
            Turn your resume into
            <span className="block text-blue-600">
              personalized interview practice.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-500 mt-4 max-w-2xl mx-auto leading-relaxed">
            Upload your resume and get interview questions tailored to your
            experience, projects, and skills.
          </p>

        </div>

        {/* ───────────────── MAIN CARD ───────────────── */}

        <div className="max-w-4xl mx-auto">

          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">

            {/* Card header */}
            <div className="px-5 sm:px-7 md:px-9 pt-6 sm:pt-8">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Upload your resume
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    PDF format required
                  </p>
                </div>

                <div className="hidden sm:flex w-11 h-11 rounded-xl bg-blue-50 items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>

              </div>

            </div>

            {/* Upload area */}
            <div className="p-5 sm:p-7 md:p-9">

              <div
                className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-7 sm:p-10 md:p-14 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50/70 scale-[1.01] shadow-lg shadow-blue-100"
                    : file
                    ? "border-emerald-300 bg-emerald-50/30"
                    : "border-slate-200 bg-slate-50/70 hover:border-blue-300 hover:bg-blue-50/30"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >

                {/* Upload decoration */}
                {!file && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-blue-100/40 blur-3xl rounded-full pointer-events-none" />
                )}

                {!file ? (
                  <>

                    {/* Icon */}
                    <div
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                        dragActive
                          ? "bg-blue-600 text-white scale-110 shadow-xl shadow-blue-200"
                          : "bg-white text-blue-600 border border-slate-200 shadow-sm"
                      }`}
                    >
                      <UploadIcon className="w-9 h-9 sm:w-10 sm:h-10" />

                      <div className="absolute -right-2 -top-2 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center border-4 border-slate-50">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                      {dragActive
                        ? "Drop your resume here"
                        : "Drag & drop your resume"}
                    </h3>

                    <p className="text-sm text-slate-500 mb-6">
                      or choose a PDF file from your device
                    </p>

                    <label className="inline-block cursor-pointer">

                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      <span className="group inline-flex items-center justify-center gap-2 bg-slate-950 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-950/15 text-sm">
                        <FileText className="w-4 h-4" />
                        Browse Files
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>

                    </label>

                    <div className="flex items-center justify-center gap-2 mt-5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <p className="text-xs text-slate-400">
                        PDF files only
                      </p>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    </div>

                  </>
                ) : (
                  <>

                    {/* Selected file */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-3xl bg-emerald-100 flex items-center justify-center relative">
                      <FileCheck2 className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-600" />

                      <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-slate-50 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <p className="text-lg sm:text-xl font-bold text-slate-900 break-all px-2">
                      {file.name}
                    </p>

                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-sm text-slate-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>

                      <span className="w-1 h-1 rounded-full bg-slate-300" />

                      <span className="text-sm text-emerald-600 font-medium">
                        PDF
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-2 mt-5 px-3.5 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Resume selected
                    </div>

                    <div className="mt-5">
                      <button
                        onClick={() => setFile(null)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Remove file
                      </button>
                    </div>

                  </>
                )}

              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-red-800 mb-0.5">
                        Upload issue
                      </p>

                      <p className="text-xs sm:text-sm text-red-700 break-words">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload button */}
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className={`group w-full mt-5 sm:mt-6 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-semibold transition-all flex items-center justify-center gap-2 ${
                  !file || loading
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
                }`}
              >

                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Upload & Continue
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}

              </button>

            </div>

            {/* Bottom benefits */}
            <div className="border-t border-slate-100 bg-slate-50/60 px-5 sm:px-7 md:px-9 py-5">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                    <FileCheck2 className="w-4 h-4 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      PDF Support
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Easy resume upload
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Personalized
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Resume-based questions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Simple & Fast
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Get started quickly
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Mobile limit */}
          {limitInfo && (
            <div className="flex sm:hidden items-center justify-center gap-2 mt-5 text-xs text-slate-500">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Resume uploads today:
              <span className="font-bold text-slate-800">
                {limitInfo.used}/{limitInfo.limit}
              </span>
            </div>
          )}

          {/* Bottom hint */}
          <div className="text-center mt-6">
            <p className="text-xs text-slate-400">
              Upload your resume to begin your personalized interview session.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Upload;