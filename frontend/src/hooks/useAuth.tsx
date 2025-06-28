import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types";
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = "http://127.0.0.1:3333/v1";

  useEffect(() => {
    const storedUser = localStorage.getItem("healthSystemUser");
    const storedToken = localStorage.getItem("healthSystemToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data: LoginResponse = await response.json();

        const loggedInUser: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          password: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUser(loggedInUser);
        localStorage.setItem("healthSystemUser", JSON.stringify(loggedInUser));
        localStorage.setItem("healthSystemToken", data.access_token);

        toast.success("Login realizado com sucesso!");
        return true;
      } else if (response.status >= 400 && response.status < 500) {
        const errorData = await response.json().catch(() => null);
        toast.warning("Credenciais inválidas. Verifique seu email e senha.");
        return false;
      } else {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
        return false;
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("healthSystemUser");
    localStorage.removeItem("healthSystemToken");
    toast.success("Logout realizado com sucesso!");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
