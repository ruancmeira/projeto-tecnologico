import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Patient } from "@/types";
import { User } from "lucide-react";
import { PatientForm, PatientFormData } from "./patients/PatientForm";
import { PatientList } from "./patients/PatientList";
import { PatientProfile } from "./patients/PatientProfile";
import { CreatePatientModal } from "./patients/CreatePatientModal";
import { usePatients } from "@/hooks/usePatients";

export const PatientManagement = () => {
  const {
    patients,
    loading,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
  } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (formData: PatientFormData) => {
    if (selectedPatient) {
      const success = await updatePatient(selectedPatient.id, formData);
      if (success) {
        setIsDialogOpen(false);
        setSelectedPatient(null);
      }
    }
  };

  const handleCreateSubmit = async (patientData: {
    name: string;
    cpf: string;
    birthDate: string;
    phone: string;
    email: string;
    address: string;
  }): Promise<boolean> => {
    const success = await createPatient(patientData);
    if (success) {
      setIsCreateModalOpen(false);
    }
    return success;
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const handleView = async (patient: Patient) => {
    // Buscar dados atualizados do paciente
    const updatedPatient = await getPatientById(patient.id);
    if (updatedPatient) {
      setViewingPatient(updatedPatient);
      setIsProfileOpen(true);
    }
  };

  const handleDelete = (patientId: number, patientName: string) => {
    setPatientToDelete({ id: patientId, name: patientName });
  };

  const confirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (patientToDelete && !isDeleting) {
      setIsDeleting(true);
      const success = await deletePatient(
        patientToDelete.id,
        patientToDelete.name
      );
      setIsDeleting(false);
      if (success) {
        setPatientToDelete(null);
      }
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedPatient(null);
  };

  if (loading && patients.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">PACIENTES</h1>
            <p className="text-slate-600 font-medium mt-2">
              Gerencie pacientes do sistema
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-600">Carregando pacientes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">PACIENTES</h1>
          <p className="text-slate-600 font-medium mt-2">
            Gerencie pacientes do sistema
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 text-white"
          disabled={loading || isDeleting}
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
        loading={loading || isDeleting}
      />

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <PatientForm
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleSubmit}
          selectedPatient={selectedPatient}
          loading={loading || isDeleting}
        />
      </Dialog>

      <CreatePatientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        loading={loading || isDeleting}
      />

      <PatientProfile
        patient={viewingPatient}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <Dialog
        open={!!patientToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setPatientToDelete(null);
          }
        }}
      >
        <DialogContent className="max-w-md bg-white">
          <button
            onClick={() => !isDeleting && setPatientToDelete(null)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none bg-white hover:bg-slate-50 text-slate-500"
            disabled={isDeleting}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogHeader>
            <DialogTitle className="text-2xl text-slate-800">
              Confirmar exclusão
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Tem certeza que deseja excluir o paciente{" "}
              <strong>{patientToDelete?.name}</strong>? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => !isDeleting && setPatientToDelete(null)}
              disabled={isDeleting}
              className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-slate-800 hover:bg-slate-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
