
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockPatients, mockDoctors, mockAppointments } from '@/data/mockData';
import { FileText, Download, TrendingUp, Users, Calendar, Activity } from 'lucide-react';
import { toast } from 'sonner';

export const Reports = () => {
  const totalPatients = mockPatients.length;
  const totalDoctors = mockDoctors.length;
  const totalAppointments = mockAppointments.length;

  // Appointments by status
  const appointmentsByStatus = mockAppointments.reduce((acc, appointment) => {
    acc[appointment.status] = (acc[appointment.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Doctors by specialty
  const doctorsBySpecialty = mockDoctors.reduce((acc, doctor) => {
    acc[doctor.specialty] = (acc[doctor.specialty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Recent activity
  const recentActivity = [
    ...mockPatients.slice(0, 3).map(p => ({
      type: 'Paciente cadastrado',
      description: p.name,
      date: p.createdAt,
      icon: Users
    })),
    ...mockAppointments.slice(0, 3).map(a => {
      const patient = mockPatients.find(p => p.id === a.patientId);
      const doctor = mockDoctors.find(d => d.id === a.doctorId);
      return {
        type: 'Consulta agendada',
        description: `${patient?.name || 'Paciente'} com Dr(a). ${doctor?.name || 'Médico'}`,
        date: a.createdAt,
        icon: Calendar
      };
    })
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

  const generatePDF = () => {
    toast.info('Geração de PDF', {
      description: 'Para implementar a geração de PDF, conecte o projeto ao Supabase através do botão verde no canto superior direito.',
      action: {
        label: 'Saiba mais',
        onClick: () => window.open('https://docs.lovable.dev/integrations/supabase/', '_blank')
      }
    });
  };

  const exportData = () => {
    toast.info('Exportação de dados', {
      description: 'Funcionalidade de exportação será implementada com integração ao backend.',
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Relatórios e Análises
          </h1>
          <p className="text-slate-600 mt-2">Estatísticas e insights do sistema de saúde</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportData} className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4 mr-2" />
            Exportar Dados
          </Button>
          <Button onClick={generatePDF} className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white">
            <FileText className="h-4 w-4 mr-2" />
            Gerar PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-blue-800">Pacientes</CardTitle>
                <div className="text-3xl font-bold text-blue-900 mt-2">{totalPatients}</div>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">Total cadastrados</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-emerald-800">Médicos</CardTitle>
                <div className="text-3xl font-bold text-emerald-900 mt-2">{totalDoctors}</div>
              </div>
              <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-emerald-700" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-emerald-700">Total cadastrados</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-teal-800">Consultas</CardTitle>
                <div className="text-3xl font-bold text-teal-900 mt-2">{totalAppointments}</div>
              </div>
              <div className="w-12 h-12 bg-teal-200 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-teal-700" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-teal-700">Total agendadas</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-blue-800">Taxa Ocupação</CardTitle>
                <div className="text-3xl font-bold text-blue-900 mt-2">78%</div>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">Média mensal</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointments by Status */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">Consultas por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(appointmentsByStatus).map(([status, count]) => (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="capitalize font-medium text-slate-700">{status}</span>
                    <span className="font-bold text-slate-900">{count}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        status === 'SCHEDULED' ? 'bg-blue-500' :
                        status === 'CONFIRMED' ? 'bg-emerald-500' :
                        status === 'CANCELLED' ? 'bg-red-500' :
                        'bg-slate-500'
                      }`}
                      style={{ width: `${(count / totalAppointments) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Doctors by Specialty */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">Médicos por Especialidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(doctorsBySpecialty).map(([specialty, count]) => (
                <div key={specialty} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">{specialty}</span>
                    <span className="font-bold text-slate-900">{count}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${(count / totalDoctors) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-lg border-0 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900">{activity.type}</p>
                      <p className="text-sm text-slate-600 truncate">{activity.description}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(activity.date).toLocaleDateString('pt-BR')} às {new Date(activity.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
