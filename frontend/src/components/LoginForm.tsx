
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        toast.error('Credenciais inválidas. Tente: admin@saude.com / admin123');
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-purple-700 to-green-700">
      <Card className="w-full max-w-md mx-4 bg-white border-2 border-gray-300 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl border-2 border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Gestão de Saúde</CardTitle>
          <p className="text-gray-800 font-semibold">Acesso administrativo</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-900 font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@saude.com"
                required
                className="mt-1 border-gray-300 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-900 font-semibold">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1 border-gray-300 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold border-0" 
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-white rounded-lg border-2 border-blue-200">
            <p className="text-sm text-gray-900 font-semibold">Credenciais de teste:</p>
            <p className="text-sm text-gray-800 font-medium">Email: admin@saude.com</p>
            <p className="text-sm text-gray-800 font-medium">Senha: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
