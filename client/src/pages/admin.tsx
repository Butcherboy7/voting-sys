import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Percent, Crown, Clock } from "lucide-react";
import type { VoteResult, VotingStats } from "@shared/schema";

interface RecentActivity {
  candidateName: string;
  timestamp: string;
}

export default function AdminPage() {
  // Fetch voting results
  const { data: results = [], isLoading: resultsLoading } = useQuery<VoteResult[]>({
    queryKey: ["/api/results"],
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  });

  // Fetch voting statistics
  const { data: stats, isLoading: statsLoading } = useQuery<VotingStats>({
    queryKey: ["/api/stats"],
    refetchInterval: 5000,
  });

  // Fetch recent activity
  const { data: recentActivity = [], isLoading: activityLoading } = useQuery<RecentActivity[]>({
    queryKey: ["/api/recent-activity"],
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes === 1) return "1 minute ago";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  const getCandidateColor = (index: number) => {
    const colors = [
      "bg-emerald-500",
      "bg-primary-500", 
      "bg-amber-500",
      "bg-purple-500",
      "bg-red-500"
    ];
    return colors[index] || "bg-slate-500";
  };

  const getCandidateColorLight = (index: number) => {
    const colors = [
      "bg-emerald-100 text-emerald-600",
      "bg-primary-100 text-primary-600",
      "bg-amber-100 text-amber-600", 
      "bg-purple-100 text-purple-600",
      "bg-red-100 text-red-600"
    ];
    return colors[index] || "bg-slate-100 text-slate-600";
  };

  if (resultsLoading || statsLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border p-6">
                <div className="h-16 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h2>
        <p className="text-slate-600">Real-time voting results and analytics</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Users className="text-primary-600 w-5 h-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Votes</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.totalVotes || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Percent className="text-emerald-600 w-5 h-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Turnout Rate</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.turnoutRate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Crown className="text-amber-600 w-5 h-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Leading</p>
                <p className="text-lg font-bold text-slate-900">{stats?.leadingCandidate || "No votes yet"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="text-red-600 w-5 h-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Time Left</p>
                <p className="text-lg font-bold text-slate-900">{stats?.timeLeft || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voting Results */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Live Results</h3>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={result.candidate.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCandidateColorLight(index)}`}>
                    <span className="font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{result.candidate.name}</h4>
                    <p className="text-sm text-slate-600">{result.candidate.grade}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32">
                    <Progress value={result.percentage} className="h-2" />
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{result.voteCount} votes</p>
                    <p className="text-sm text-slate-600">{result.percentage}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Recent Activity</h3>
          {activityLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between py-2">
                  <div className="h-4 bg-slate-200 rounded flex-1 mr-4"></div>
                  <div className="h-3 bg-slate-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <p className="text-slate-600 text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${getCandidateColor(index % 5)}`}></div>
                    <span className="text-sm text-slate-600">New vote for {activity.candidateName}</span>
                  </div>
                  <span className="text-xs text-slate-500">{formatTimeAgo(activity.timestamp)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
