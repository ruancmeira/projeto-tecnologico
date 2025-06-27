
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/LoginForm';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Home } from '@/components/Home';
import { UserManagement } from '@/components/UserManagement';
import { PatientManagement } from '@/components/PatientManagement';
import { DoctorManagement } from '@/components/DoctorManagement';
import { AppointmentsManager } from '@/components/AppointmentsManager';

const Index = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-800 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'users':
        return <UserManagement />;
      case 'patients':
        return <PatientManagement />;
      case 'doctors':
        return <DoctorManagement />;
      case 'appointments':
        return <AppointmentsManager />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
