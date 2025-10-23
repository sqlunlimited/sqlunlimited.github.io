
// import React from 'react';
// import { Code, Home, Info, Database, Github, User, ArrowRight } from 'lucide-react';

// const AboutPage = ({ onNavigate }) => {
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Code className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
//               <h1 className="text-lg md:text-2xl font-bold text-gray-900">SQL_Unlimited</h1>
//             </div>
//             <nav className="flex items-center gap-1 sm:gap-2">
//               <button
//                 onClick={() => onNavigate('landing')}
//                 className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm md:text-base font-medium"
//               >
//                 <Home className="w-4 h-4" />
//                 <span className="hidden xs:inline">Home</span>
//               </button>
//               <button
//                 onClick={() => onNavigate('practice')}
//                 className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs sm:text-sm md:text-base font-medium"
//               >
//                 <Database className="w-4 h-4" />
//                 <span className="hidden xs:inline">Practice</span>
//               </button>
//               <button
//                 onClick={() => onNavigate('about')}
//                 className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-xs sm:text-sm md:text-base font-medium"
//               >
//                 <Info className="w-4 h-4" />
//                 <span className="hidden xs:inline">About</span>
//               </button>
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
//         <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 lg:p-12">
//           <div className="text-center mb-6 sm:mb-8 md:mb-12">
//             <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-100 rounded-full mb-3 sm:mb-4">
//               <Info className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">About SQL_Unlimited</h1>
//             <p className="text-base sm:text-lg md:text-xl text-gray-600">
//               🚧 This page is under development
//             </p>
//           </div>

//           <div className="space-y-3 sm:space-y-4 md:space-y-6 text-gray-700 text-sm sm:text-base">
//             <div className="bg-blue-50 border-l-4 border-blue-600 p-3 sm:p-4 md:p-6 rounded">
//               <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
//               <p className="mb-2 sm:mb-3 md:mb-4">
//                 We're working on an amazing About page that will include:
//               </p>
//               <ul className="space-y-1 sm:space-y-1.5 md:space-y-2 list-disc list-inside text-xs sm:text-sm md:text-base">
//                 <li>Detailed project information</li>
//                 <li>How to contribute questions</li>
//                 <li>Team and contributors</li>
//                 <li>Technology stack details</li>
//                 <li>Roadmap and future features</li>
//               </ul>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8">
//               <div className="bg-gray-50 p-3 sm:p-4 md:p-6 rounded-lg">
//                 <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-xs sm:text-sm md:text-base">
//                   <Github className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
//                   Open Source
//                 </h3>
//                 <p className="text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4">
//                   This project is open source and welcomes contributions from the community.
//                 </p>
//                 <a
//                   href="https://github.com/sqlunlimited/sqlunlimited.github.io"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium"
//                 >
//                   View on GitHub
//                   <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
//                 </a>
//               </div>

//               <div className="bg-gray-50 p-3 sm:p-4 md:p-6 rounded-lg">
//                 <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-xs sm:text-sm md:text-base">
//                   <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
//                   Creator
//                 </h3>
//                 <p className="text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4">
//                   Built with love by a SQL enthusiast who wanted to make learning SQL accessible to everyone.
//                 </p>
//                 <a
//                   href="https://www.linkedin.com/in/sukhpreet41/"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium"
//                 >
//                   Connect on LinkedIn
//                   <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
//                 </a>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 sm:mt-8 md:mt-12 text-center">
//             <button
//               onClick={() => onNavigate('practice')}
//               className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition font-semibold inline-flex items-center gap-2 text-xs sm:text-sm md:text-base"
//             >
//               Start Practicing SQL
//               <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
//             </button>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-gray-300 mt-8 sm:mt-12 md:mt-16 pt-6 pb-4 sm:pb-6">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//             <div className="flex items-center gap-2">
//               <Code className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
//               <span className="font-semibold text-xs sm:text-sm md:text-base">SQL_Unlimited</span>
//             </div>
//           </div>
//           <div className="mt-4 text-center text-xs sm:text-sm text-gray-500">
//             © 2025 SQL_Unlimited. Open source project.
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default AboutPage;











// import React from 'react';
// import {
//   Code,
//   Users,
//   Target,
//   Zap,
//   Github,
//   BookOpen,
//   Database,
//   Flame,
//   CheckCircle,
//   AlertCircle,
//   Heart,
//   Share2,
//   TrendingUp,
//   Globe,
//   Coffee,
//   Smartphone,
//   Home,
//   Sparkles,
// } from 'lucide-react';

// const AboutUsPage = ({ onNavigate }) => {
//   return (
// <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       {/* Header */}
// <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full">
//   <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 w-full">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Code className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
//               <h1 className="text-lg md:text-2xl font-bold text-gray-900">
//                 SQL_Unlimited
//               </h1>
//             </div>
//             {onNavigate && (
//               <button
//                 onClick={() => onNavigate('practice')}
//                 className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition text-sm md:text-base font-medium"
//               >
//                 <Home className="w-4 h-4" />
//                 <span>Back to Practice</span>
//               </button>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
// <section className="max-w-7xl mx-auto px-4 py-8 md:py-16 w-full">
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
//             <Sparkles className="w-4 h-4" />
//             Community Powered Learning
//           </div>
//           <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
//             About SQL_Unlimited
//           </h2>
//           <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
//             A free, open-source SQL practice platform built by developers, for developers.
//           </p>
//         </div>

//         {/* Mission Card */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-8">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//               <Target className="w-6 h-6 text-blue-600" />
//             </div>
//             <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
//               Our Mission
//             </h3>
//           </div>
//           <p className="text-base md:text-lg text-gray-700 leading-relaxed">
//             SQL_Unlimited is a community-driven platform designed to help developers 
//             master SQL through real-world interview questions and practice problems. 
//             We believe that the best learning resources come from the community itself - 
//             questions that people actually face in interviews, challenges they encounter 
//             at work, and problems they find valuable.
//           </p>
//         </div>

//         {/* Key Features Grid */}
//         <div className="grid md:grid-cols-2 gap-6 mb-8">
//           {/* Community Driven */}
//           <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
//             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
//               <Users className="w-6 h-6 text-purple-600" />
//             </div>
//             <h4 className="text-xl font-bold text-gray-900 mb-3">
//               Community Driven
//             </h4>
//             <p className="text-gray-600 mb-4">
//               Anyone can contribute questions they've been asked in interviews or found 
//               useful online. Your contributions help fellow developers grow!
//             </p>
//             <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
//               <Share2 className="w-4 h-4" />
//               <span>Share your knowledge</span>
//             </div>
//           </div>

//           {/* Open Source */}
//           <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
//             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
//               <Github className="w-6 h-6 text-green-600" />
//             </div>
//             <h4 className="text-xl font-bold text-gray-900 mb-3">
//               100% Open Source
//             </h4>
//             <p className="text-gray-600 mb-4">
//               All code is open source on GitHub. Contribute questions, fix bugs, 
//               or suggest features. It's built by the community, for the community.
//             </p>
//             <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
//               <Code className="w-4 h-4" />
//               <span>View on GitHub</span>
//             </div>
//           </div>

//           {/* Free Forever */}
//           <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
//             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
//               <Heart className="w-6 h-6 text-blue-600" />
//             </div>
//             <h4 className="text-xl font-bold text-gray-900 mb-3">
//               Free Forever
//             </h4>
//             <p className="text-gray-600 mb-4">
//               No subscriptions, no paywalls, no premium tiers. SQL_Unlimited will 
//               always be completely free for everyone to use and learn from.
//             </p>
//             <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
//               <Globe className="w-4 h-4" />
//               <span>Accessible to all</span>
//             </div>
//           </div>

//           {/* Real Practice */}
//           <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
//             <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
//               <Database className="w-6 h-6 text-orange-600" />
//             </div>
//             <h4 className="text-xl font-bold text-gray-900 mb-3">
//               Real SQL Practice
//             </h4>
//             <p className="text-gray-600 mb-4">
//               Practice with both SQLite and PostgreSQL engines. Execute queries 
//               in real-time and see instant results - just like in actual interviews.
//             </p>
//             <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
//               <Zap className="w-4 h-4" />
//               <span>Instant feedback</span>
//             </div>
//           </div>
//         </div>

//         {/* How to Contribute Section */}
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-10 text-white mb-8">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
//               <BookOpen className="w-6 h-6 text-white" />
//             </div>
//             <h3 className="text-2xl md:text-3xl font-bold">
//               How to Contribute Questions
//             </h3>
//           </div>
          
//           <div className="space-y-4 mb-6">
//             <p className="text-base md:text-lg text-white/90 leading-relaxed">
//               Contributing is easy! Questions are added in JSON format through our GitHub repository.
//             </p>
            
//             <div className="bg-white/10 backdrop-blur rounded-xl p-4 md:p-6">
//               <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
//                 <CheckCircle className="w-5 h-5" />
//                 Steps to Contribute:
//               </h4>
//               <ol className="space-y-3 text-white/90">
//                 <li className="flex gap-3">
//                   <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">1</span>
//                   <span>Visit our GitHub repository</span>
//                 </li>
//                 <li className="flex gap-3">
//                   <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">2</span>
//                   <span>Create a new JSON file in the questions folder</span>
//                 </li>
//                 <li className="flex gap-3">
//                   <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">3</span>
//                   <span>Follow the template format (schema, description, expected output, etc.)</span>
//                 </li>
//                 <li className="flex gap-3">
//                   <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">4</span>
//                   <span>Submit a pull request with your question</span>
//                 </li>
//               </ol>
//             </div>
//           </div>

//           <a
//             href="https://github.com/sqlunlimited/sql_questions"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-lg transition font-semibold text-base"
//           >
//             <Github className="w-5 h-5" />
//             View Repository & Template
//           </a>
//         </div>

//         {/* Important Notice */}
//         <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
//           <div className="flex items-start gap-4">
//             <div className="flex-shrink-0 w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
//               <AlertCircle className="w-6 h-6 text-yellow-700" />
//             </div>
//             <div>
//               <h4 className="text-lg font-bold text-yellow-900 mb-2">
//                 📱 Important: About Your Progress & Data
//               </h4>
//               <div className="space-y-2 text-yellow-800">
//                 <p className="flex items-start gap-2">
//                   <span className="text-yellow-600 mt-1">•</span>
//                   <span>
//                     <strong>No Backend Yet:</strong> We don't have a backend server currently. 
//                     All your streaks and completed questions are saved locally in your browser's storage.
//                   </span>
//                 </p>
//                 <p className="flex items-start gap-2">
//                   <span className="text-yellow-600 mt-1">•</span>
//                   <span>
//                     <strong>Use Same Device & Browser:</strong> To maintain your progress, 
//                     please use the same device and browser. Switching devices or browsers will 
//                     reset your progress.
//                   </span>
//                 </p>
//                 <p className="flex items-start gap-2">
//                   <span className="text-yellow-600 mt-1">•</span>
//                   <span>
//                     <strong>Workaround:</strong> If you use multiple devices, consider keeping 
//                     a notepad/note to track which questions you've completed. 😊
//                   </span>
//                 </p>
//                 <p className="flex items-start gap-2">
//                   <span className="text-yellow-600 mt-1">•</span>
//                   <span>
//                     <strong>Coming Soon:</strong> Backend support with user accounts is planned 
//                     for future updates to sync your progress across devices!
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Features Highlights */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//           <div className="bg-white rounded-lg p-4 shadow hover:shadow-md transition">
//             <div className="flex items-center gap-3">
//               <Flame className="w-8 h-8 text-orange-500" />
//               <div>
//                 <h5 className="font-semibold text-gray-900">Daily Streaks</h5>
//                 <p className="text-sm text-gray-600">Track your consistency</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg p-4 shadow hover:shadow-md transition">
//             <div className="flex items-center gap-3">
//               <TrendingUp className="w-8 h-8 text-green-500" />
//               <div>
//                 <h5 className="font-semibold text-gray-900">Progress Tracking</h5>
//                 <p className="text-sm text-gray-600">See what you've mastered</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg p-4 shadow hover:shadow-md transition">
//             <div className="flex items-center gap-3">
//               <Smartphone className="w-8 h-8 text-blue-500" />
//               <div>
//                 <h5 className="font-semibold text-gray-900">Mobile Friendly</h5>
//                 <p className="text-sm text-gray-600">Practice anywhere</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer CTA */}
//         <div className="bg-gray-900 rounded-2xl p-6 md:p-10 text-center">
//           <Coffee className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
//           <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
//             Built with ❤️, ☕, and Community Spirit
//           </h3>
//           <p className="text-gray-300 text-base md:text-lg mb-6 max-w-2xl mx-auto">
//             This is a hobby project, entirely vibe-coded! If you find bugs, please 
//             fix them if you can - otherwise, reach out and we'll sort it together.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <a
//               href="https://github.com/sqlunlimited/sqlunlimited.github.io"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-lg transition font-semibold"
//             >
//               <Github className="w-5 h-5" />
//               View Platform Code
//             </a>
//             <a
//               href="https://www.linkedin.com/in/sukhpreet41/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition font-semibold"
//             >
//               <Users className="w-5 h-5" />
//               Connect on LinkedIn
//             </a>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AboutUsPage;






import React from 'react';
import {
  Code,
  Users,
  Target,
  Zap,
  Github,
  BookOpen,
  Database,
  Flame,
  CheckCircle,
  AlertCircle,
  Heart,
  Share2,
  TrendingUp,
  Globe,
  Coffee,
  Smartphone,
  Home,
  Sparkles,
} from 'lucide-react';

const AboutUsPage = ({ onNavigate }) => {
  return (
    // ✅ ADDED: overflow-x-hidden to prevent horizontal scroll
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                SQL_Unlimited
              </h1>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('practice')}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition text-sm md:text-base font-medium"
              >
                <Home className="w-4 h-4" />
                <span>Back to Practice</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Community Powered Learning
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            About SQL_Unlimited
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            A free, open-source SQL practice platform built by developers, for developers.
          </p>
        </div>

        {/* ... rest of your component remains the same ... */}

        {/* Footer CTA */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-10 text-center">
          <Coffee className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Built with ❤️, ☕, and Community Spirit
          </h3>
          <p className="text-gray-300 text-base md:text-lg mb-6 max-w-2xl mx-auto">
            This is a hobby project, entirely vibe-coded! If you find bugs, please 
            fix them if you can - otherwise, reach out and we'll sort it together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/sqlunlimited/sqlunlimited.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-lg transition font-semibold"
            >
              <Github className="w-5 h-5" />
              View Platform Code
            </a>
            <a
              href="https://www.linkedin.com/in/sukhpreet41/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition font-semibold"
            >
              <Users className="w-5 h-5" />
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;