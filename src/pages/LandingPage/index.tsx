import { ArrowRight, CheckIcon, Zap } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import dashboardPreview from '../../assets/demo.png';

const LandingPage = () => {
  useDocumentTitle('Super Todo is super tool with AI');

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <svg
              className="h-8 w-8 text-indigo-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <div className="ml-2 text-xl font-bold text-gray-900">Super-Todo</div>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal" redirectUrl="/dashboard">
                <button className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal" redirectUrl="/dashboard">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all">
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

      {/* Main Content - Cố định trong 1 màn hình */}
      <main className="flex-1 flex items-center">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Column - Text Content */}
          <div className="md:w-1/2 flex flex-col items-start">
            <div className="bg-indigo-600/10 text-indigo-600 font-medium px-3 py-1.5 rounded-full inline-flex items-center mb-6">
              <Zap size={14} className="mr-1.5" />
              <span className="text-sm">SMART TASK MANAGEMENT</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Super-Todo is{' '}
              <span className="relative">
                <span className="relative z-10">super</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-indigo-200/70 -z-10 skew-x-3"></span>
              </span>{' '}
              tool
            </h1>

            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-2xl md:text-3xl font-bold py-2 px-4 rounded-lg inline-block mb-6">
              with AI
            </div>

            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Super-Todo streamlines task management with an intuitive interface and smart
              automation to help you stay organized and boost productivity.
            </p>

            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all flex items-center">
                    Get Started Free <ArrowRight size={18} className="ml-2" />
                  </button>
                </SignInButton>
              </SignedOut>
            </div>

            <div className="mt-10 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="bg-green-100 p-1 rounded-full">
                  <CheckIcon size={14} className="text-green-600" />
                </div>
                <span>Smart AI-powered task suggestions</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="bg-green-100 p-1 rounded-full">
                  <CheckIcon size={14} className="text-green-600" />
                </div>
                <span>Beautiful Kanban boards for paid users</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="bg-green-100 p-1 rounded-full">
                  <CheckIcon size={14} className="text-green-600" />
                </div>
                <span>Seamless team collaboration</span>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="md:w-1/2 relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-200 bg-white">
              <div className="h-6 bg-gray-100 flex items-center px-3 border-b border-gray-200">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="relative">
                {/* Ảnh mockup của app */}
                <img
                  src={dashboardPreview}
                  alt="Super-Todo Dashboard Preview"
                  className="w-full"
                  onError={(e) => {
                    // Fallback khi không có hình
                    e.currentTarget.src =
                      'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="300" viewBox="0 0 500 300" preserveAspectRatio="none"%3E%3Crect fill="%23f8fafc" width="500" height="300" /%3E%3Ctext fill="%23818cf8" font-family="sans-serif" font-size="30" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ESuper Todo Dashboard%3C/text%3E%3C/svg%3E';
                  }}
                />

                {/* Hiệu ứng glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 rounded-full w-32 h-32 bg-purple-300/20 -top-6 -right-6 blur-xl"></div>
            <div className="absolute -z-10 rounded-full w-40 h-40 bg-indigo-300/20 -bottom-10 -left-10 blur-xl"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
