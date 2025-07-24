import { Link, useLocation } from "wouter";
import { Vote, BarChart3 } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Vote className="text-primary-600 text-xl mr-3" />
              <h1 className="text-xl font-bold text-slate-900">Student Elections 2024</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <a
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                  location === "/"
                    ? "text-primary-600 bg-primary-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Vote className="w-4 h-4 mr-2" />
                Voting
              </a>
            </Link>
            <Link href="/admin">
              <a
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                  location === "/admin"
                    ? "text-primary-600 bg-primary-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Admin Dashboard
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
