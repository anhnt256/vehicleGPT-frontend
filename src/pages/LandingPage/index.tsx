import { ArrowRight, Shield, FileText, BarChart3, Zap, CheckCircle2 } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const LandingPage = () => {
  useDocumentTitle('vehicleGPT - AI-Powered Insurance Management');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIHN0cm9rZT0iIzRCNTU2NyIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

        {/* Header */}
        <header className="relative z-10 px-6 py-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-emerald-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                vehicleGPT
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all">
                    Get Started
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-4xl mx-auto">
              {/* Hero Text */}
              <div className="text-center space-y-8 mb-16">
                <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full mx-auto">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">AI-POWERED INSURANCE MANAGEMENT</span>
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Smart Insurance
                  </span>
                  <br />
                  Management
                  <br />
                  <span className="text-gray-400">Powered by AI</span>
                </h1>

                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Transform your insurance operations with AI-driven insights, automated claims
                  processing, and real-time risk assessment.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-medium shadow-lg transition-all flex items-center justify-center space-x-2">
                        <span>Start Free Trial</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-medium shadow-lg transition-all flex items-center justify-center space-x-2">
                    <span>Schedule Demo</span>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        d="M5 3l14 9-14 9V3z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-800/50 p-8 rounded-2xl backdrop-blur-sm border border-slate-700/50 hover:border-emerald-500/50 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-emerald-500/10 p-3 rounded-lg">
                      <Shield className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold">Risk Assessment</h3>
                  </div>
                  <p className="text-gray-400">
                    AI-powered analysis of insurance risks and automated underwriting
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center space-x-2 text-gray-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Real-time risk scoring</span>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Automated underwriting</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 p-8 rounded-2xl backdrop-blur-sm border border-slate-700/50 hover:border-emerald-500/50 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-emerald-500/10 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold">Claims Processing</h3>
                  </div>
                  <p className="text-gray-400">
                    Streamlined claims management with AI-powered automation
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center space-x-2 text-gray-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Automated claims validation</span>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Fraud detection</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 p-8 rounded-2xl backdrop-blur-sm border border-slate-700/50 hover:border-emerald-500/50 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-emerald-500/10 p-3 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold">Analytics</h3>
                  </div>
                  <p className="text-gray-400">Advanced analytics for better decision making</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center space-x-2 text-gray-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Predictive analytics</span>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Performance insights</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-400">99.9%</div>
                  <div className="text-gray-400 mt-2">Claim Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-400">50%</div>
                  <div className="text-gray-400 mt-2">Faster Processing</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-400">24/7</div>
                  <div className="text-gray-400 mt-2">AI Support</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-400">100K+</div>
                  <div className="text-gray-400 mt-2">Processed Claims</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
