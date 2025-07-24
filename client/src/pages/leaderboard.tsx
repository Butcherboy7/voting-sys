import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Award } from "lucide-react";
import type { VoteResult } from "@shared/schema";

export default function LeaderboardPage() {
  const { data: results = [], isLoading } = useQuery<VoteResult[]>({
    queryKey: ["/api/results"],
    refetchInterval: 5000,
  });

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-amber-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-slate-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-slate-600 font-bold">{index + 1}</div>;
    }
  };

  const getRankClass = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200";
      case 1:
        return "bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200";
      case 2:
        return "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200";
      default:
        return "bg-white border-slate-200";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border p-6">
                <div className="h-16 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalVotes = results.reduce((sum, result) => sum + result.voteCount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Election Results</h2>
        <p className="text-slate-600">Current standings in the student council election</p>
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg">
          <Trophy className="text-primary-600 w-4 h-4 mr-2" />
          <span className="text-primary-800 text-sm font-medium">Total Votes: {totalVotes}</span>
        </div>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={result.candidate.id} className={`${getRankClass(index)} transition-all duration-200 hover:shadow-md`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getRankIcon(index)}
                  <div className="flex items-center space-x-4">
                    <img
                      src={result.candidate.imageUrl}
                      alt={result.candidate.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{result.candidate.name}</h3>
                      <p className="text-primary-600 font-medium">{result.candidate.grade}</p>
                      <p className="text-sm text-slate-600 mt-1">{result.candidate.platform}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div className="w-32">
                      <Progress value={result.percentage} className="h-3" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{result.voteCount}</p>
                      <p className="text-sm text-slate-600">{result.percentage}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Results Yet</h3>
            <p className="text-slate-600">Voting is still in progress. Results will appear here once available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}