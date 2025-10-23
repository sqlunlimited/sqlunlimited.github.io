import React from 'react';
import { Code, Home, Info, ArrowRight, Database, BookOpen, Github, User, Zap, Heart, Globe, AlertCircle, Settings, ListChecks, BarChart3 } from 'lucide-react';

const GITHUB_REPO = 'sqlunlimited/sql_questions';

export default function LandingPage({ onNavigate }) {

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">SQL_Unlimited</h1>
            </div>
            <nav className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => window.open(`https://github.com/${GITHUB_REPO}`, '_blank')}
                className="flex items-center gap-1 px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition text-xs sm:text-sm"
              >
                <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Contribute</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
            Master SQL Through Practice
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
            Learn SQL By
            <span className="text-blue-600"> Doing</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Practice real-world SQL problems with instant feedback. No setup required. 
            Run queries directly in your browser with SQLite and PostgreSQL support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button
              onClick={() => onNavigate('practice')}
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Start Practicing
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => onNavigate('')}
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 hover:bg-gray-50 rounded-lg transition text-base sm:text-lg font-semibold border-2 border-gray-300 w-full sm:w-auto"
            >
              Learn More
              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </section>


      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">

    {/* Multiple Engines */}
    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
        <Database className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Multiple Engines</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4">
        Practice with both SQLite and PostgreSQL. Switch between engines to understand dialect differences.
      </p>
      <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
        <Settings className="w-4 h-4" />
        <span>Switch anytime</span>
      </div>
    </div>

    {/* Real Problems */}
    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Real Problems</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4">
        Curated questions from actual interviews. Practice problems organized by difficulty level.
      </p>
      <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
        <ListChecks className="w-4 h-4" />
        <span>Structured learning</span>
      </div>
    </div>

    {/* Instant Feedback */}
    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition sm:col-span-2 md:col-span-1">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
        <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Instant Feedback</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4">
        Get immediate validation of your solutions. Track your progress as you solve problems.
      </p>
      <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
        <BarChart3 className="w-4 h-4" />
        <span>Progress tracking</span>
      </div>
    </div>

    {/* Open Source */}
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
        <Github className="w-6 h-6 text-green-600" />
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-3">
        100% Open Source
      </h4>
      <p className="text-gray-600 mb-4">
        Contribute questions, fix bugs, 
        or suggest features. It's built by the community, for the community.
      </p>
      <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
        <Code className="w-4 h-4" />
        <span>View on GitHub</span>
      </div>
    </div>

    {/* Free Forever */}
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        <Heart className="w-6 h-6 text-blue-600" />
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-3">
        Free Forever
      </h4>
      <p className="text-gray-600 mb-4">
        No subscriptions, no paywalls, no premium tiers. SQL_Unlimited will 
        always be completely free for everyone to use and learn from.
      </p>
      <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
        <Globe className="w-4 h-4" />
        <span>Accessible to all</span>
      </div>
    </div>

  </div>
</section>


<section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Important Notice */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-700" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-yellow-900 mb-2">
                Important: About Your Progress & Data
              </h4>
              <div className="space-y-2 text-yellow-800">
                <p className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>
                    <strong>No Backend Yet:</strong> We don't have a backend server currently. 
                    All your streaks and completed questions are saved locally in your browser's storage.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>
                    <strong>Use Same Device & Browser:</strong> To maintain your progress, 
                    please use the same device and browser. Switching devices or browsers will 
                    reset your progress.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>
                    <strong>Workaround:</strong> If you use multiple devices, consider keeping 
                    a notepad/note to track which questions you've completed. 😊
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>
                    <strong>Coming Soon:</strong> Backend support with user accounts is planned 
                    for future updates to sync your progress across devices!
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        </section>  
      

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Master SQL?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90">
            Start practicing now - completely free, no sign-up required.
          </p>
          <button
            onClick={() => onNavigate('practice')}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-lg transition text-base sm:text-lg font-semibold shadow-lg inline-flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Launch Practice Platform
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-12 sm:mt-16">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              <span className="text-sm sm:text-base font-semibold">SQL_Unlimited</span>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-500">
            © 2025. Made with ❤️ in Punjab.
          </div>
        </div>
      </footer>
    </div>
  );
}


