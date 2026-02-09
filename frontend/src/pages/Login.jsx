import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center space-x-3 mb-4">
              <div className="bg-primary-500 p-3 rounded-xl">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">AGRANOVA</h1>
            </div>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Info */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-500 to-primary-700 p-12 text-white items-center">
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold mb-6">Welcome to AGRANOVA</h2>
          <p className="text-xl mb-8 text-primary-100">
            Smart irrigation and monitoring platform for modern agriculture
          </p>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Sprout className="w-5 h-5" />
              </div>
              <span>Real-time soil and weather monitoring</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Sprout className="w-5 h-5" />
              </div>
              <span>Automated irrigation control</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Sprout className="w-5 h-5" />
              </div>
              <span>AI-powered agricultural assistance</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
