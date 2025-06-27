
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  User, 
  Calendar, 
  Search, 
  Edit,
  ChartBar,
  Key
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBar },
    { id: 'patients', label: 'Pacientes', icon: User },
    { id: 'doctors', label: 'Médicos', icon: User },
    { id: 'appointments', label: 'Consultas', icon: Calendar },
    { id: 'search', label: 'Pesquisar', icon: Search },
    { id: 'reports', label: 'Relatórios', icon: ChartBar },
  ];

  return (
    <div className={cn(
      "bg-white border-r border-border h-screen flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg">Sistema Saúde</h2>
              <p className="text-xs text-muted-foreground">Gestão Hospitalar</p>
            </div>
          )}
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
                  "w-full justify-start gap-3",
                  collapsed && "px-2"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={logout}
        >
          {!collapsed ? 'Sair' : <Key className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
