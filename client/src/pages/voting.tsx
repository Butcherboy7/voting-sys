import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Vote, Info, CheckCircle } from "lucide-react";
import type { Candidate } from "@shared/schema";

interface User {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  hasVoted: boolean;
}

interface VotingPageProps {
  user: User;
  setUser: (user: User) => void;
}

export default function VotingPage({ user, setUser }: VotingPageProps) {
  const { toast } = useToast();

  const { data: candidates = [], isLoading: candidatesLoading } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"],
  });

  const voteMutation = useMutation({
    mutationFn: async (candidateId: number) => {
      const response = await apiRequest("POST", "/api/vote", { candidateId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Vote submitted successfully!",
        description: "Thank you for participating in the election.",
        variant: "default",
      });
      setUser({ ...user, hasVoted: true });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit vote",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVote = (candidateId: number) => {
    if (user?.hasVoted || voteMutation.isPending) {
      return;
    }
    voteMutation.mutate(candidateId);
  };

  if (candidatesLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded mb-4"></div>
                <div className="h-10 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Cast Your Vote</h2>
        <p className="text-slate-600">Choose your preferred candidate for Student Council President</p>
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <Info className="text-amber-600 w-4 h-4 mr-2" />
          <span className="text-amber-800 text-sm font-medium">You can only vote once</span>
        </div>
      </div>

      {user?.hasVoted && (
        <div className="mb-6">
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="text-emerald-600 w-8 h-8 mx-auto mb-2" />
                <h3 className="text-emerald-800 font-semibold">Thank you for voting!</h3>
                <p className="text-emerald-700 text-sm">Your vote has been recorded successfully.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <img
                src={candidate.imageUrl}
                alt={`${candidate.name} - Student Council Candidate`}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-slate-100"
              />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{candidate.name}</h3>
                <p className="text-primary-600 text-sm font-medium mb-2">{candidate.grade}</p>
                <p className="text-slate-600 text-sm mb-4">{candidate.platform}</p>
                <Button
                  onClick={() => handleVote(candidate.id)}
                  disabled={user?.hasVoted || voteMutation.isPending}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium"
                >
                  <Vote className="w-4 h-4 mr-2" />
                  {voteMutation.isPending ? "Submitting..." : `Vote for ${candidate.name.split(' ')[0]}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
