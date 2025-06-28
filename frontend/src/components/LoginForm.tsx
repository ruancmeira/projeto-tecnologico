import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: boolean | string;
    password?: boolean | string;
  }>({});
  const { login } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = () => {
    const newErrors: {
      email?: boolean | string;
      password?: boolean | string;
    } = {};

    if (!email) {
      newErrors.email = "Campo obrigatório";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      newErrors.password = "Campo obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      // Erro já tratado no hook useAuth
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500/90 via-violet-500/90 to-purple-600/90">
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            {/* Logo and header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-indigo-500 mb-4">
                <span className="text-2xl font-bold">G</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Gestão de Saúde
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Acesso administrativo
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Email field */}
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: false });
                    }}
                    placeholder="Digite seu email"
                    className={`pl-10 py-5 bg-white text-slate-800 rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-slate-400 ${
                      errors.email
                        ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                        : "border-slate-200 focus-visible:border-slate-400 focus-visible:ring-slate-400"
                    }`}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center text-red-500 text-xs mt-1 ml-1">
                    <AlertCircle size={12} className="mr-1" />
                    <span>
                      {typeof errors.email === "string"
                        ? errors.email
                        : "Campo obrigatório"}
                    </span>
                  </div>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors({ ...errors, password: false });
                    }}
                    placeholder="Digite sua senha"
                    className={`pl-10 py-5 bg-white text-slate-800 rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-slate-400 ${
                      errors.password
                        ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                        : "border-slate-200 focus-visible:border-slate-400 focus-visible:ring-slate-400"
                    }`}
                  />
                </div>
                {errors.password && (
                  <div className="flex items-center text-red-500 text-xs mt-1 ml-1">
                    <AlertCircle size={12} className="mr-1" />
                    <span>
                      {typeof errors.password === "string"
                        ? errors.password
                        : "Campo obrigatório"}
                    </span>
                  </div>
                )}
              </div>

              {/* Login button */}
              <Button
                type="submit"
                className="w-full py-5 bg-slate-800 hover:bg-slate-700 text-white text-base font-medium rounded-lg transition-all shadow-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <span>Entrar</span>
                )}
              </Button>

              {/* Credenciais de teste */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Credenciais para teste:
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Email:</span> admin@hospital.com
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Senha:</span> admin123
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
