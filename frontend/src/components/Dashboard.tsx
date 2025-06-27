
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockPatients, mockDoctors, mockAppointments } from '@/data/mockData';
import { User, Calendar, ChartBar } from 'lucide-react';

export const Dashboard = () => {
  const totalPatients = mockPatients.length;
  const totalDoctors = mockDoctors.length;
  const totalAppointments = mockAppointments.length;
  const appointmentsToday = mockAppointments.filter(
    app => app.date === new Date().toISOString().split('T')[0]
  ).length;

  const recentAppointments = mockAppointments.slice(0, 5);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'Agendado';
      case 'CONFIRMED': return 'Confirmado';
      case 'CANCELLED': return 'Cancelado';
      case 'COMPLETED': return 'Concluído';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-600 font-medium">Visão geral do sistema de saúde</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Total de Pacientes</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalPatients}</div>
            <p className="text-xs text-slate-600 font-medium">Pacientes cadastrados</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Total de Médicos</CardTitle>
            <User className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalDoctors}</div>
            <p className="text-xs text-slate-600 font-medium">Médicos cadastrados</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Consultas Totais</CardTitle>
            <Calendar className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalAppointments}</div>
            <p className="text-xs text-slate-600 font-medium">Consultas agendadas</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Hoje</CardTitle>
            <ChartBar className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{appointmentsToday}</div>
            <p className="text-xs text-slate-600 font-medium">Consultas hoje</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">Próximas Consultas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAppointments.map((appointment) => {
              const patient = mockPatients.find(p => p.id === appointment.patientId);
              const doctor = mockDoctors.find(d => d.id === appointment.doctorId);
              
              return (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-800">{patient?.name || 'Paciente não encontrado'}</p>
                    <p className="text-sm text-slate-600 font-medium">
                      Dr(a). {doctor?.name || 'Médico não encontrado'} • {doctor?.specialty || ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">{new Date(appointment.date).toLocaleDateString('pt-BR')}</p>
                    <p className="text-sm text-slate-600 font-medium">{appointment.time}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                      {getStatusLabel(appointment.status)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
