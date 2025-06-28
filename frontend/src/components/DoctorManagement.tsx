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
import { Doctor } from "@/types";
import { Stethoscope } from "lucide-react";
import { DoctorForm, DoctorFormData } from "./doctors/DoctorForm";
import { DoctorList } from "./doctors/DoctorList";
import { DoctorProfile } from "./doctors/DoctorProfile";
import { CreateDoctorModal } from "./doctors/CreateDoctorModal";
import { useDoctors } from "@/hooks/useDoctors";

export const DoctorManagement = () => {
  const {
    doctors,
    loading,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
  } = useDoctors();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (formData: DoctorFormData) => {
    if (selectedDoctor) {
      const success = await updateDoctor(selectedDoctor.id, formData);
      if (success) {
        setIsDialogOpen(false);
        setSelectedDoctor(null);
      }
    }
  };

  const handleCreateSubmit = async (doctorData: {
    name: string;
    cpf: string;
    specialty: string;
    crm: string;
    address: string;
  }): Promise<boolean> => {
    const success = await createDoctor(doctorData);
    if (success) {
      setIsCreateModalOpen(false);
    }
    return success;
  };

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDialogOpen(true);
  };

  const handleView = async (doctor: Doctor) => {
    // Buscar dados atualizados do médico
    const updatedDoctor = await getDoctorById(doctor.id);
    if (updatedDoctor) {
      setViewingDoctor(updatedDoctor);
      setIsProfileOpen(true);
    }
  };

  const handleDelete = (doctorId: number, doctorName: string) => {
    setDoctorToDelete({ id: doctorId, name: doctorName });
  };

  const confirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (doctorToDelete && !isDeleting) {
      setIsDeleting(true);
      const success = await deleteDoctor(
        doctorToDelete.id,
        doctorToDelete.name
      );
      setIsDeleting(false);
      if (success) {
        setDoctorToDelete(null);
      }
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedDoctor(null);
  };

  if (loading && doctors.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">MÉDICOS</h1>
            <p className="text-slate-600 font-medium mt-2">
              Gerencie médicos do sistema
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-600">Carregando médicos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">MÉDICOS</h1>
          <p className="text-slate-600 font-medium mt-2">
            Cadastre e gerencie informações dos médicos
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 text-white"
          disabled={loading || isDeleting}
        >
          <Stethoscope className="h-4 w-4 mr-2" />
          Novo Médico
        </Button>
      </div>

      <DoctorList
        doctors={doctors}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        loading={loading || isDeleting}
      />

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DoctorForm
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleSubmit}
          selectedDoctor={selectedDoctor}
          loading={loading || isDeleting}
        />
      </Dialog>

      <CreateDoctorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        loading={loading || isDeleting}
      />

      <DoctorProfile
        doctor={viewingDoctor}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <Dialog
        open={!!doctorToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDoctorToDelete(null);
          }
        }}
      >
        <DialogContent className="max-w-md bg-white">
          <button
            onClick={() => !isDeleting && setDoctorToDelete(null)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500"
            disabled={isDeleting}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogHeader>
            <DialogTitle className="text-2xl text-slate-800">
              Confirmar exclusão
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Tem certeza que deseja excluir o médico{" "}
              <strong>Dr(a). {doctorToDelete?.name}</strong>? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => !isDeleting && setDoctorToDelete(null)}
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
