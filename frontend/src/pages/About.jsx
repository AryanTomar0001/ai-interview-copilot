import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Mic, Target, Zap, Code, Database, Server, MessageSquare } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Resume-based Question Generation",
      description: "Advanced RAG system analyzes your resume to generate personalized interview questions tailored to your experience."
    },
    {
      icon: <Mic className="w-8 h-8 text-purple-600" />,
      title: "Speech-to-Text Evaluation",
      description: "Real-time voice recognition powered by Whisper AI to transcribe and evaluate your spoken responses accurately."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Hybrid ML Scoring",
      description: "Intelligent scoring system combining multiple ML models to provide comprehensive performance metrics."
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-green-600" />,
      title: "AI Feedback System",
      description: "Get detailed, actionable feedback on your answers to continuously improve your interview skills."
    }
  ];

  const techStack = [
    { name: "React", category: "Frontend", color: "bg-blue-100 text-blue-700" },
    { name: "FastAPI", category: "Backend", color: "bg-green-100 text-green-700" },
    { name: "Node.js", category: "Server", color: "bg-emerald-100 text-emerald-700" },
    { name: "MongoDB", category: "Database", color: "bg-purple-100 text-purple-700" },
    { name: "FAISS", category: "Vector DB", color: "bg-orange-100 text-orange-700" },
    { name: "Whisper", category: "AI Model", color: "bg-pink-100 text-pink-700" }
  ];

  const challenges = [
    {
      challenge: "API Rate Limits",
      learning: "Implemented intelligent caching and request queuing to optimize API usage and reduce costs."
    },
    {
      challenge: "JSON Parsing Complexity",
      learning: "Built robust error handling and validation layers to manage complex AI-generated JSON responses."
    },
    {
      challenge: "State Management",
      learning: "Designed efficient state architecture to handle real-time audio processing and multi-step interview flows."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Brain className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">AI Interview Copilot</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Smart AI-powered interview preparation platform
          </p>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              AI Interview Copilot is an intelligent interview preparation platform that leverages cutting-edge AI 
              technologies to help candidates excel in technical interviews. By analyzing your resume, the system 
              generates personalized questions, evaluates your responses in real-time, and provides comprehensive 
              feedback to accelerate your interview readiness. Whether you're preparing for your first job or your 
              next career move, our platform adapts to your unique background and learning pace.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tech Stack</h2>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {techStack.map((tech, index) => (
                <div key={index} className="text-center">
                  <div className={`${tech.color} rounded-lg py-3 px-4 font-semibold`}>
                    {tech.name}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{tech.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">System Architecture</h2>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 rounded-lg p-6 w-40 text-center">
                  <Code className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Frontend</p>
                  <p className="text-sm text-gray-600">React + Tailwind</p>
                </div>
              </div>
              
              <div className="hidden md:block">
                <div className="w-16 h-1 bg-gray-300"></div>
              </div>
              <div className="md:hidden">
                <div className="w-1 h-16 bg-gray-300"></div>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-green-100 rounded-lg p-6 w-40 text-center">
                  <Server className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Node Server</p>
                  <p className="text-sm text-gray-600">Express.js</p>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="w-16 h-1 bg-gray-300"></div>
              </div>
              <div className="md:hidden">
                <div className="w-1 h-16 bg-gray-300"></div>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-purple-100 rounded-lg p-6 w-40 text-center">
                  <Database className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">FastAPI</p>
                  <p className="text-sm text-gray-600">AI Processing</p>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-600 mt-6">
              Request flow: Frontend → Node.js Middleware → FastAPI Backend → AI Models
            </p>
          </div>
        </div>
      </section>

      {/* Challenges & Learnings Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Challenges & Learnings</h2>
          <div className="space-y-4">
            {challenges.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-600 mb-1">Challenge:</h3>
                    <p className="text-gray-700">{item.challenge}</p>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-gray-300"></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-600 mb-1">Learning:</h3>
                    <p className="text-gray-700">{item.learning}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Ace Your Interview?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Start practicing with AI-powered personalized questions today
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-md"
            >
              Start Practicing
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center text-gray-600">
          <p>© 2026 AI Interview Copilot. Built with ❤️ for aspiring professionals.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
