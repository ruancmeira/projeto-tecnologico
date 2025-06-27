
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  Stethoscope, 
  Calendar,
  UserCog,
  LogOut
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'users', label: 'USUÁRIOS', icon: UserCog },
    { id: 'patients', label: 'PACIENTES', icon: Users },
    { id: 'doctors', label: 'MÉDICOS', icon: Stethoscope },
    { id: 'appointments', label: 'CONSULTAS', icon: Calendar },
  ];

  return (
    <div className="w-64 bg-white border-r-2 border-gray-300 h-screen flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-6 border-b-2 border-gray-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900">Gestão de Saúde</h2>
            <p className="text-sm text-gray-700 font-medium">Painel Administrativo</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12 text-left font-semibold",
                  activeTab === item.id 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t-2 border-gray-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-700">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
};
