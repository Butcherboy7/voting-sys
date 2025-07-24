import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  hasVoted: boolean;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        if (res.status === 401) {
          return null;
        }
        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        return res.json();
      } catch (error) {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const login = async (email: string, password: string) => {
    const response = await apiRequest("POST", "/api/login", { email, password });
    return response.json();
  };

  const adminLogin = async (username: string, password: string) => {
    const response = await apiRequest("POST", "/api/admin-login", { username, password });
    return response.json();
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await apiRequest("POST", "/api/register", { email, password, name });
    return response.json();
  };

  const logout = async () => {
    const response = await apiRequest("POST", "/api/logout", {});
    return response.json();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    adminLogin,
    register,
    logout,
  };
}