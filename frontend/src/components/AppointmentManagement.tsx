import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/types";
import { Calendar } from "lucide-react";
import { CreateAppointmentModal } from "./appointments/CreateAppointmentModal";
import { AppointmentList } from "./appointments/AppointmentList";
import { useAppointments } from "@/hooks/useAppointments";
import { useDoctors } from "@/hooks/useDoctors";
import { usePatients } from "@/hooks/usePatients";

export const AppointmentManagement = () => {
  const {
    appointments,
    loading,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    confirmAppointment,
    cancelAppointment,
    completeAppointment,
  } = useAppointments();

  const { doctors, fetchDoctors } = useDoctors();
  const { patients, fetchPatients } = usePatients();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  useEffect(() => {
    fetchDoctors();
    fetchPatients();
  }, []);

  const handleCreateSubmit = async (
    appointmentData: Omit<Appointment, "id" | "createdAt" | "updatedAt">
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      if (selectedAppointment) {
        
        return await updateAppointment(selectedAppointment.id, appointmentData);
      } else {
        
        return await createAppointment(appointmentData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (appointmentId: number, patientName: string) => {
    await deleteAppointment(appointmentId, patientName);
  };

  const handleConfirm = async (appointmentId: number) => {
    await confirmAppointment(appointmentId);
  };

  const handleCancel = async (appointmentId: number) => {
    await cancelAppointment(appointmentId);
  };

  const handleComplete = async (appointmentId: number) => {
    await completeAppointment(appointmentId);
  };

  const handleClose = () => {
    setSelectedAppointment(null);
    setIsCreateModalOpen(false);
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">CONSULTAS</h1>
            <p className="text-slate-600 font-medium mt-2">
              Agende e gerencie consultas
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-600">Carregando consultas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">CONSULTAS</h1>
          <p className="text-slate-600 font-medium mt-2">
            Agende e gerencie consultas
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 text-white"
          disabled={loading || isSubmitting}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Nova Consulta
        </Button>
      </div>

      
      <AppointmentList
        appointments={appointments}
        patients={patients}
        doctors={doctors}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onComplete={handleComplete}
        loading={loading || isSubmitting}
      />

      <CreateAppointmentModal
        isOpen={isCreateModalOpen}
        onClose={handleClose}
        onSubmit={handleCreateSubmit}
        patients={patients}
        doctors={doctors}
        selectedAppointment={selectedAppointment}
        isLoading={isSubmitting}
      />
    </div>
  );
};
