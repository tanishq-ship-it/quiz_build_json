import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      const response = await loginApi({ email: email.trim(), password });
      login(response.token, response.user);
      navigate('/admin');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f9fafb] via-[#eef2ff] to-[#e0f2fe] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-sky-400/35 blur-3xl" />
        <div className="absolute -bottom-40 -right-16 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />
      </div>

      {/* Subtle texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl bg-white/70 border border-white/80 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.16)] p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30 mb-4">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-inter-semibold tracking-[-0.01em] text-slate-900">
              Quiz Builder
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to access the admin portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-inter-medium text-slate-700">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@admin.com"
                autoComplete="email"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-violet-400/70 transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-inter-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 py-2.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-violet-400/70 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-rose-50 border border-rose-100 px-4 py-3">
                <p className="text-xs text-rose-600">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-violet-600 text-sm font-inter-medium text-white shadow-sm shadow-violet-500/40 hover:bg-violet-500 hover:shadow-md hover:shadow-violet-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-slate-400">
            Admin access only. Contact your administrator for credentials.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
