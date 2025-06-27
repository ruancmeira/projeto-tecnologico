
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { mockAppointments, mockDoctors, mockPatients } from '@/data/mockData';
import { Appointment } from '@/types';
import { Calendar, Edit, Clock, Stethoscope, X } from 'lucide-react';
import { toast } from 'sonner';
import { CreateAppointmentModal } from './appointments/CreateAppointmentModal';

export const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<{ id: number; patientName: string } | null>(null);

  const handleCreateSubmit = (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedAppointment) {
      // Update existing appointment
      const updatedAppointment: Appointment = {
        ...selectedAppointment,
        ...appointmentData,
        updatedAt: new Date().toISOString()
      };
      setAppointments(appointments.map(a => a.id === selectedAppointment.id ? updatedAppointment : a));
      toast.success('Consulta atualizada com sucesso!', {
        description: `A consulta foi atualizada para ${new Date(appointmentData.date).toLocaleDateString('pt-BR')}.`
      });
    } else {
      // Create new appointment
      const newAppointment: Appointment = {
        id: Math.max(...appointments.map(a => a.id)) + 1,
        ...appointmentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setAppointments([...appointments, newAppointment]);
      toast.success('Consulta agendada com sucesso!', {
        description: `Nova consulta foi agendada para ${new Date(appointmentData.date).toLocaleDateString('pt-BR')}.`
      });
    }
    setSelectedAppointment(null);
    setIsCreateModalOpen(false);
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (appointmentId: number, patientName: string) => {
    setAppointmentToDelete({ id: appointmentId, patientName });
  };

  const confirmDelete = () => {
    if (appointmentToDelete) {
      setAppointments(appointments.filter(a => a.id !== appointmentToDelete.id));
      toast.success('Consulta removida com sucesso!', {
        description: `A consulta de ${appointmentToDelete.patientName} foi removida do sistema.`
      });
      setAppointmentToDelete(null);
    }
  };

  const handleClose = () => {
    setSelectedAppointment(null);
    setIsCreateModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'Agendado';
      case 'CONFIRMED': return 'Confirmado';
      case 'CANCELLED': return 'Cancelado';
      case 'COMPLETED': return 'Concluído';
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">CONSULTAS</h1>
          <p className="text-slate-600 font-medium mt-2">Agende e gerencie consultas</p>
        </div>
        
        <Button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white border-0"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Nova Consulta
        </Button>
      </div>

      {/* Appointments Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {appointments.map((appointment) => {
          const patient = mockPatients.find(p => p.id === appointment.patientId);
          const doctor = mockDoctors.find(d => d.id === appointment.doctorId);
          
          return (
            <Card key={appointment.id} className="group hover:shadow-lg transition-all duration-300 border border-slate-200 bg-white">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-800 group-hover:text-blue-700 transition-colors">
                        {patient?.name || 'Paciente não encontrado'}
                      </CardTitle>
                      <p className="text-sm text-slate-600 flex items-center mt-1">
                        <Stethoscope className="h-3 w-3 mr-1" />
                        Dr(a). {doctor?.name || 'Médico não encontrado'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(appointment)}
                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(appointment.id, patient?.name || 'Paciente')}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-slate-500" />
                      <span className="font-medium text-slate-700">{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-slate-500" />
                      <span className="font-medium text-slate-700">{appointment.time}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-2 text-xs text-slate-500 border-t border-slate-100">
                  <span>Agendado em {new Date(appointment.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {appointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">Nenhuma consulta agendada</h3>
          <p className="text-slate-500">Comece agendando a primeira consulta do sistema.</p>
        </div>
      )}

      <CreateAppointmentModal
        isOpen={isCreateModalOpen}
        onClose={handleClose}
        onSubmit={handleCreateSubmit}
        patients={mockPatients}
        doctors={mockDoctors}
        selectedAppointment={selectedAppointment}
      />

      <AlertDialog open={!!appointmentToDelete} onOpenChange={() => setAppointmentToDelete(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a consulta de <strong>{appointmentToDelete?.patientName}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
