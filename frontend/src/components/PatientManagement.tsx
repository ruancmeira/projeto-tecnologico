
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { mockPatients } from '@/data/mockData';
import { Patient } from '@/types';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import { PatientForm, PatientFormData } from './patients/PatientForm';
import { PatientList } from './patients/PatientList';
import { PatientProfile } from './patients/PatientProfile';
import { CreatePatientModal } from './patients/CreatePatientModal';

export const PatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<{ id: number; name: string } | null>(null);

  const handleSubmit = (formData: PatientFormData) => {
    if (selectedPatient) {
      const updatedPatients = patients.map(p => 
        p.id === selectedPatient.id 
          ? { ...p, ...formData, updatedAt: new Date().toISOString() }
          : p
      );
      setPatients(updatedPatients);
      toast.success('Paciente atualizado com sucesso!', {
        description: `${formData.name} foi atualizado no sistema.`
      });
    }

    setIsDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleCreateSubmit = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPatient: Patient = {
      id: Math.max(...patients.map(p => p.id)) + 1,
      ...patientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPatients([...patients, newPatient]);
    toast.success('Paciente cadastrado com sucesso!', {
      description: `${patientData.name} foi adicionado ao sistema.`
    });
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const handleView = (patient: Patient) => {
    setViewingPatient(patient);
    setIsProfileOpen(true);
  };

  const handleDelete = (patientId: number, patientName: string) => {
    setPatientToDelete({ id: patientId, name: patientName });
  };

  const confirmDelete = () => {
    if (patientToDelete) {
      setPatients(patients.filter(p => p.id !== patientToDelete.id));
      toast.success('Paciente removido com sucesso!', {
        description: `${patientToDelete.name} foi removido do sistema.`
      });
      setPatientToDelete(null);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedPatient(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">PACIENTES</h1>
          <p className="text-slate-600 font-medium mt-2">Cadastre e gerencie informações dos pacientes</p>
        </div>
        
        <Button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
        >
          <User className="h-4 w-4 mr-2" />
          Novo Paciente
        </Button>
      </div>

      <PatientList
        patients={patients}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <PatientForm
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleSubmit}
          selectedPatient={selectedPatient}
        />
      </Dialog>

      <CreatePatientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <PatientProfile
        patient={viewingPatient}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <AlertDialog open={!!patientToDelete} onOpenChange={() => setPatientToDelete(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o paciente <strong>{patientToDelete?.name}</strong>? Esta ação não pode ser desfeita.
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
