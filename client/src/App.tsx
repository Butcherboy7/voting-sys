import { Switch, Route } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import VotingPage from "@/pages/voting";
import AdminPage from "@/pages/admin";
import LeaderboardPage from "@/pages/leaderboard";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";

interface User {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  hasVoted: boolean;
}

function Router() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.log("Not authenticated");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navigation user={user} onLogout={() => setUser(null)} />
      <Switch>
        {user.isAdmin ? (
          <>
            <Route path="/" component={AdminPage} />
            <Route path="/admin" component={AdminPage} />
          </>
        ) : (
          <Route path="/" component={() => <VotingPage user={user} setUser={setUser} />} />
        )}
        <Route path="/leaderboard" component={LeaderboardPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
