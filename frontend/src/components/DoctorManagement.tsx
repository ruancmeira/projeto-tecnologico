
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { mockDoctors } from '@/data/mockData';
import { Doctor } from '@/types';
import { Stethoscope, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { CreateDoctorModal } from './doctors/CreateDoctorModal';

export const DoctorManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<{ id: number; name: string } | null>(null);

  const handleCreateSubmit = (doctorData: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedDoctor) {
      // Update existing doctor
      const updatedDoctor: Doctor = {
        ...selectedDoctor,
        ...doctorData,
        updatedAt: new Date().toISOString()
      };
      setDoctors(doctors.map(d => d.id === selectedDoctor.id ? updatedDoctor : d));
      toast.success('Médico atualizado com sucesso!', {
        description: `Dr(a). ${doctorData.name} foi atualizado no sistema.`
      });
    } else {
      // Create new doctor
      const newDoctor: Doctor = {
        id: Math.max(...doctors.map(d => d.id)) + 1,
        ...doctorData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setDoctors([...doctors, newDoctor]);
      toast.success('Médico cadastrado com sucesso!', {
        description: `Dr(a). ${doctorData.name} foi adicionado ao sistema.`
      });
    }
    setSelectedDoctor(null);
    setIsCreateModalOpen(false);
  };

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (doctorId: number, doctorName: string) => {
    setDoctorToDelete({ id: doctorId, name: doctorName });
  };

  const confirmDelete = () => {
    if (doctorToDelete) {
      setDoctors(doctors.filter(d => d.id !== doctorToDelete.id));
      toast.success('Médico removido com sucesso!', {
        description: `Dr(a). ${doctorToDelete.name} foi removido do sistema.`
      });
      setDoctorToDelete(null);
    }
  };

  const handleClose = () => {
    setSelectedDoctor(null);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">MÉDICOS</h1>
          <p className="text-slate-600 font-medium mt-2">Cadastre e gerencie informações dos médicos</p>
        </div>
        
        <Button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
        >
          <Stethoscope className="h-4 w-4 mr-2" />
          Novo Médico
        </Button>
      </div>

      {/* Doctors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Dr(a). {doctor.name}</h3>
                <p className="text-sm text-slate-600">{doctor.specialty}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <p><span className="font-medium text-slate-700">CRM:</span> {doctor.crm}</p>
              <p><span className="font-medium text-slate-700">CPF:</span> {doctor.cpf}</p>
              <p><span className="font-medium text-slate-700">Endereço:</span> {doctor.address}</p>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(doctor)}
                className="text-blue-600 hover:bg-blue-50"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(doctor.id, doctor.name)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {doctors.length === 0 && (
        <div className="text-center py-12">
          <Stethoscope className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">Nenhum médico cadastrado</h3>
          <p className="text-slate-500">Comece cadastrando o primeiro médico do sistema.</p>
        </div>
      )}

      <CreateDoctorModal
        isOpen={isCreateModalOpen}
        onClose={handleClose}
        onSubmit={handleCreateSubmit}
        selectedDoctor={selectedDoctor}
      />

      <AlertDialog open={!!doctorToDelete} onOpenChange={() => setDoctorToDelete(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o médico <strong>Dr(a). {doctorToDelete?.name}</strong>? Esta ação não pode ser desfeita.
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
