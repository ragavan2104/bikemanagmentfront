import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">

      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Left Branding Section */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">Bike Dealership</h1>
          <p className="text-lg opacity-90">
            Smart Management System for Inventory, Sales & Analytics
          </p>
          <div className="mt-8 text-sm opacity-80">
            Secure • Fast • Reliable
          </div>
        </div>

        {/* Right Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10">

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Sign in to your account
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your credentials to access the dashboard
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@bikedealer.com"
                className="mt-1 w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Optional Debug */}
          <button
            type="button"
            onClick={async () => {
              const user = (await import('../config/firebase')).auth.currentUser;
              if (user) {
                const token = await user.getIdTokenResult(true);
                alert(`Role: ${token.claims.role || 'No role set'}`);
              } else {
                alert('No user logged in');
              }
            }}
            className="w-full mt-3 text-xs text-gray-500 hover:text-gray-700"
          >
            Debug: Check Role
          </button>

        </div>
      </div>
    </div>
  );
};

export default Login;
