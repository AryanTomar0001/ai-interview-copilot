import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import Questions from "./pages/Questions";
import Interview from "./pages/Interview";
import Result from "./pages/Result";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Upload />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/questions"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Questions />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Interview />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/result"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Result />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <Layout>
                    <About />
                  </Layout>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;