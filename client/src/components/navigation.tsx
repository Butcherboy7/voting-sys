import { Button } from "@/components/ui/button";
import { LogOut, BarChart3, Vote } from "lucide-react";

interface User {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  hasVoted: boolean;
}

interface NavigationProps {
  user: User;
  onLogout: () => void;
}

export default function Navigation({ user, onLogout }: NavigationProps) {
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      onLogout();
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user.isAdmin ? (
                <BarChart3 className="h-6 w-6 text-blue-600" />
              ) : (
                <Vote className="h-6 w-6 text-green-600" />
              )}
              <h1 className="text-xl font-bold text-gray-900">
                {user.isAdmin ? "Admin Dashboard" : "Student Elections 2024"}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}