import {
  Shield,
  FileText,
  BarChart3,
  Zap,
  CheckCircle2,
  Users,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const Dashboard = () => {
  useDocumentTitle('Dashboard - vehicleGPT');

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome to vehicleGPT</h1>
          <p className="text-gray-400 mt-2">Your AI-powered insurance management platform</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-emerald-500/10 p-3 rounded-lg">
            <Shield className="h-6 w-6 text-emerald-400" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            VehicleGPT
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Policies</p>
              <h3 className="text-2xl font-bold mt-1">1,234</h3>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-emerald-400 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Claims</p>
              <h3 className="text-2xl font-bold mt-1">89</h3>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-400 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>Avg. processing time: 2.3 days</span>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Customers</p>
              <h3 className="text-2xl font-bold mt-1">5,678</h3>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-purple-400 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+8% from last quarter</span>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">AI Accuracy</p>
              <h3 className="text-2xl font-bold mt-1">98.5%</h3>
            </div>
            <div className="bg-cyan-500/10 p-3 rounded-lg">
              <Zap className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-cyan-400 text-sm">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            <span>Industry leading performance</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm border border-slate-700/50">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center space-x-2 p-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
              <FileText className="h-5 w-5 text-emerald-400" />
              <span>New Policy</span>
            </button>
            <button className="flex items-center space-x-2 p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
              <Shield className="h-5 w-5 text-blue-400" />
              <span>Process Claim</span>
            </button>
            <button className="flex items-center space-x-2 p-4 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
              <Users className="h-5 w-5 text-purple-400" />
              <span>Add Customer</span>
            </button>
            <button className="flex items-center space-x-2 p-4 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              <span>View Reports</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm border border-slate-700/50">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-500/10 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-medium">New policy created</p>
                <p className="text-sm text-gray-400">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="font-medium">Claim processed</p>
                <p className="text-sm text-gray-400">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="font-medium">New customer added</p>
                <p className="text-sm text-gray-400">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
