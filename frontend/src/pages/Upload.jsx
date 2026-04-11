import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, FileText, CheckCircle } from "lucide-react";
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
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 w-full">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              AI Interview Copilot
            </h1>
            <p className="text-sm md:text-base text-gray-600 break-words whitespace-normal">
              Upload your resume to get started with personalized interview questions
            </p>
            {limitInfo && (
              <p className="text-xs md:text-sm text-gray-500 mt-2">
                Resume uploads today: {limitInfo.used}/{limitInfo.limit}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-4">
            <div
              className={`border-2 border-dashed rounded-xl p-6 md:p-12 text-center transition-all ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!file ? (
                <>
                  <UploadIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-base md:text-lg font-semibold text-gray-700 mb-2">
                    Drag and drop your resume here
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 mb-4">or</p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span className="bg-black text-white px-4 py-2 md:px-6 md:py-3 rounded-lg cursor-pointer hover:bg-gray-800 transition text-sm md:text-base inline-block">
                      Browse Files
                    </span>
                  </label>
                  <p className="text-xs text-gray-400 mt-4">PDF files only</p>
                </>
              ) : (
                <>
                  <CheckCircle className="w-12 h-12 md:w-16 md:h-16 mx-auto text-green-500 mb-4" />
                  <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <p className="text-sm md:text-lg font-semibold text-gray-700 break-words whitespace-normal text-center">
                      {file.name}
                    </p>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mb-4">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700 text-xs md:text-sm font-medium"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-xs md:text-sm break-words whitespace-normal">{error}</p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full mt-4 md:mt-6 bg-black text-white py-2 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </span>
              ) : (
                "Upload & Continue"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Upload;