import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen bg-surface-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-surface-50/80 backdrop-blur-sm border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-black text-sm font-semibold">L</span>
            </div>
            <span className="text-lg font-semibold text-surface-900">LearnHub</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg cursor-pointer transition-all duration-150"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-button hover:shadow-button-hover cursor-pointer transition-all duration-150"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold text-surface-900 tracking-tight leading-tight">
            Learning made simple,
            <br />
            <span className="text-primary-600">progress made visible.</span>
          </h1>
          <p className="mt-6 text-xl text-surface-600 leading-relaxed max-w-2xl">
            A thoughtfully designed learning platform that adapts to how you think. 
            Master new skills through interactive lessons, track your growth, and 
            celebrate every milestone.
          </p>
          
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-button hover:shadow-elevated cursor-pointer transition-all duration-150"
            >
              Start learning free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <button className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-surface-700 bg-white rounded-xl hover:bg-surface-50 border border-surface-200 hover:border-surface-300 shadow-card hover:shadow-card-hover cursor-pointer transition-all duration-150">
              <svg className="w-5 h-5 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-y border-surface-200">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-semibold text-surface-900">
              Everything you need to learn effectively
            </h2>
            <p className="mt-4 text-lg text-surface-600">
              Built with care for learners of all ages and abilities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200 shadow-card hover:shadow-card-hover hover:border-surface-300 transition-all duration-150 cursor-default">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">Curated Topics</h3>
              <p className="text-surface-600 leading-relaxed">
                Over 100 carefully structured topics across science, math, art, and more. 
                Each designed for progressive mastery.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200 shadow-card hover:shadow-card-hover hover:border-surface-300 transition-all duration-150 cursor-default">
              <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">Interactive Learning</h3>
              <p className="text-surface-600 leading-relaxed">
                Engage with hands-on exercises, visual explanations, and real-world 
                examples that make concepts click.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-surface-50 border border-surface-200 shadow-card hover:shadow-card-hover hover:border-surface-300 transition-all duration-150 cursor-default">
              <div className="w-12 h-12 rounded-xl bg-success-100 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">Clear Progress</h3>
              <p className="text-surface-600 leading-relaxed">
                See exactly where you are in your learning journey. Celebrate wins 
                and identify areas for growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-semibold text-surface-900">100+</div>
            <div className="mt-1 text-sm text-surface-500 font-medium">Topics</div>
          </div>
          <div>
            <div className="text-4xl font-semibold text-surface-900">50K+</div>
            <div className="mt-1 text-sm text-surface-500 font-medium">Learners</div>
          </div>
          <div>
            <div className="text-4xl font-semibold text-surface-900">4.9</div>
            <div className="mt-1 text-sm text-surface-500 font-medium">App rating</div>
          </div>
          <div>
            <div className="text-4xl font-semibold text-surface-900">95%</div>
            <div className="mt-1 text-sm text-surface-500 font-medium">Completion rate</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold text-white">
            Ready to start your learning journey?
          </h2>
          <p className="mt-4 text-lg text-primary-100 max-w-xl mx-auto">
            Join thousands of learners who are building knowledge, one lesson at a time.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-base font-medium text-primary-600 bg-white rounded-xl hover:bg-primary-50 shadow-button hover:shadow-elevated cursor-pointer transition-all duration-150"
          >
            Get started for free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-900">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-600 text-sm font-semibold">L</span>
              </div>
              <span className="text-lg font-semibold text-black">LearnHub</span>
            </div>
            <div className="flex gap-8 text-sm text-surface-400">
              <a href="#" className="hover:text-white cursor-pointer transition-colors duration-150">Privacy</a>
              <a href="#" className="hover:text-white cursor-pointer transition-colors duration-150">Terms</a>
              <a href="#" className="hover:text-white cursor-pointer transition-colors duration-150">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-surface-800 text-center text-sm text-surface-500">
            © 2026 LearnHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
