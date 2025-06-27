
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Appointment, Patient, Doctor } from '@/types';

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  patients: Patient[];
  doctors: Doctor[];
  selectedAppointment?: Appointment | null;
}

export const CreateAppointmentModal = ({ isOpen, onClose, onSubmit, patients, doctors, selectedAppointment }: CreateAppointmentModalProps) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    status: 'SCHEDULED' as 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
    patientId: 0,
    doctorId: 0
  });

  useEffect(() => {
    if (isOpen) {
      if (selectedAppointment) {
        const appointmentDate = new Date(selectedAppointment.date);
        const dateString = appointmentDate.toISOString().split('T')[0];
        
        setFormData({
          date: dateString,
          time: selectedAppointment.time,
          status: selectedAppointment.status,
          patientId: selectedAppointment.patientId,
          doctorId: selectedAppointment.doctorId
        });
      } else {
        setFormData({ date: '', time: '', status: 'SCHEDULED', patientId: 0, doctorId: 0 });
      }
    }
  }, [isOpen, selectedAppointment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert date string to Date object
    const appointmentDate = new Date(formData.date + 'T' + formData.time);
    
    onSubmit({
      date: appointmentDate.toISOString(),
      time: formData.time,
      status: formData.status,
      patientId: formData.patientId,
      doctorId: formData.doctorId
    });
    setFormData({ date: '', time: '', status: 'SCHEDULED', patientId: 0, doctorId: 0 });
    onClose();
  };

  const handleClose = () => {
    setFormData({ date: '', time: '', status: 'SCHEDULED', patientId: 0, doctorId: 0 });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-white border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-800">
            {selectedAppointment ? 'Editar Consulta' : 'Cadastrar Nova Consulta'}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            {selectedAppointment ? 'Atualize os dados da consulta' : 'Preencha os dados da nova consulta'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-slate-700">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
                className="h-11 border-slate-300 focus:border-teal-500 bg-white text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium text-slate-700">Horário *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                required
                className="h-11 border-slate-300 focus:border-teal-500 bg-white text-slate-900"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient" className="text-sm font-medium text-slate-700">Paciente *</Label>
              <Select value={formData.patientId.toString()} onValueChange={(value) => setFormData({...formData, patientId: parseInt(value)})}>
                <SelectTrigger className="h-11 border-slate-300 focus:border-teal-500 bg-white text-slate-900">
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-300">
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor" className="text-sm font-medium text-slate-700">Médico *</Label>
              <Select value={formData.doctorId.toString()} onValueChange={(value) => setFormData({...formData, doctorId: parseInt(value)})}>
                <SelectTrigger className="h-11 border-slate-300 focus:border-teal-500 bg-white text-slate-900">
                  <SelectValue placeholder="Selecione o médico" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-300">
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      Dr(a). {doctor.name} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-slate-700">Status *</Label>
            <Select value={formData.status} onValueChange={(value: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => setFormData({...formData, status: value})}>
              <SelectTrigger className="h-11 border-slate-300 focus:border-teal-500 bg-white text-slate-900">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300">
                <SelectItem value="SCHEDULED">Agendado</SelectItem>
                <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
                <SelectItem value="COMPLETED">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={handleClose} className="border-slate-300 text-slate-700 hover:bg-slate-50">
              Cancelar
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white border-0">
              {selectedAppointment ? 'Atualizar Consulta' : 'Cadastrar Consulta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
