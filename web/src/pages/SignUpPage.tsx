import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement signup logic
    console.log('Sign up:', { name, email, password });
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:8000/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex lg:flex-1 bg-primary-600 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Start your learning journey
          </h2>
          <p className="text-primary-100 leading-relaxed">
            Join thousands of learners building knowledge through interactive lessons and personalized paths.
          </p>

          {/* Testimonial */}
          <div className="mt-12 p-6 bg-white/10 rounded-2xl text-left">
            <p className="text-white/90 italic leading-relaxed">
              "LearnHub helped me understand math concepts I'd struggled with for years. The adaptive learning is incredible."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">SK</span>
              </div>
              <div>
                <div className="text-white font-medium text-sm">Sarah K.</div>
                <div className="text-primary-200 text-xs">Completed 12 courses</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg px-2 py-1.5 -ml-2 cursor-pointer transition-all duration-150 mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-semibold">L</span>
            </div>
            <span className="text-xl font-semibold text-surface-900">LearnHub</span>
          </Link>

          {/* Header */}
          <h1 className="text-2xl font-semibold text-surface-900">
            Create your account
          </h1>
          <p className="mt-2 text-surface-600">
            Start learning for free. No credit card required.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {/* Social Signup */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-surface-300 rounded-xl text-surface-700 font-medium hover:bg-surface-50 hover:border-surface-400 shadow-card hover:shadow-card-hover cursor-pointer transition-all duration-150"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-surface-300 rounded-xl text-surface-700 font-medium hover:bg-surface-50 hover:border-surface-400 shadow-card hover:shadow-card-hover cursor-pointer transition-all duration-150"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-surface-200"></div>
            <span className="px-4 text-sm text-surface-500">or</span>
            <div className="flex-1 border-t border-surface-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-surface-700 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full px-4 py-3 bg-white border border-surface-300 rounded-xl text-surface-900 placeholder-surface-400 hover:border-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-inner-soft transition-all duration-150"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-white border border-surface-300 rounded-xl text-surface-900 placeholder-surface-400 hover:border-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-inner-soft transition-all duration-150"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-white border border-surface-300 rounded-xl text-surface-900 placeholder-surface-400 hover:border-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-inner-soft transition-all duration-150"
                placeholder="••••••••"
              />
              <p className="mt-1.5 text-xs text-surface-500">Must be at least 8 characters</p>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-button hover:shadow-elevated cursor-pointer transition-all duration-150"
            >
              Create account
            </button>
          </form>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-surface-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700 cursor-pointer transition-colors duration-150">
              Sign in
            </Link>
          </p>

          {/* Terms */}
          <p className="mt-8 text-center text-xs text-surface-500 leading-relaxed">
            By creating an account, you agree to our{' '}
            <a href="#" className="underline hover:text-surface-700 cursor-pointer transition-colors duration-150">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-surface-700 cursor-pointer transition-colors duration-150">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
