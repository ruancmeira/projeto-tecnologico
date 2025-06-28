import { Appointment, Doctor, Patient } from "@/types";
import {
  Calendar,
  Edit,
  Clock,
  Stethoscope,
  X,
  Check,
  Ban,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

interface AppointmentListProps {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: number, patientName: string) => void;
  onConfirm: (id: number) => void;
  onCancel: (id: number) => void;
  onComplete: (id: number) => void;
  loading?: boolean;
}

export const AppointmentList = ({
  appointments,
  patients,
  doctors,
  onEdit,
  onDelete,
  onConfirm,
  onCancel,
  onComplete,
  loading = false,
}: AppointmentListProps) => {
  const [appointmentToDelete, setAppointmentToDelete] = useState<{
    id: number;
    patientName: string;
  } | null>(null);

  const handleDelete = (appointmentId: number, patientName: string) => {
    setAppointmentToDelete({ id: appointmentId, patientName });
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (appointmentToDelete) {
      onDelete(appointmentToDelete.id, appointmentToDelete.patientName);
      setAppointmentToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "Agendado";
      case "CONFIRMED":
        return "Confirmado";
      case "CANCELLED":
        return "Cancelado";
      case "COMPLETED":
        return "Concluído";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  if (appointments.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-700 mb-2">
          Nenhuma consulta agendada
        </h3>
        <p className="text-slate-500">
          Comece agendando a primeira consulta do sistema.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2, 3, 4].map((index) => (
          <Card
            key={index}
            className="border border-slate-200 bg-white animate-pulse"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                  <div>
                    <div className="h-5 w-40 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-4 w-24 bg-slate-200 rounded"></div>
                  <div className="h-4 w-16 bg-slate-200 rounded"></div>
                </div>
                <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div className="h-3 w-32 bg-slate-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        {appointments.map((appointment) => {
          const patient = patients.find(
            (p) => p.id === appointment.patientId
          ) ||
            appointment.patient || { name: "Paciente não encontrado" };
          const doctor = doctors.find((d) => d.id === appointment.doctorId) ||
            appointment.doctor || {
              name: "Médico não encontrado",
              specialty: "",
            };

          return (
            <Card
              key={appointment.id}
              className="group hover:shadow-lg transition-all duration-300 border border-slate-200 bg-white"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-800 group-hover:text-blue-700 transition-colors">
                        {patient.name}
                      </CardTitle>
                      <p className="text-sm text-slate-600 flex items-center mt-1">
                        <Stethoscope className="h-3 w-3 mr-1" />
                        Dr(a). {doctor.name}{" "}
                        {doctor.specialty ? `- ${doctor.specialty}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {appointment.status === "SCHEDULED" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onConfirm(appointment.id)}
                        className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                        title="Confirmar consulta"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {(appointment.status === "SCHEDULED" ||
                      appointment.status === "CONFIRMED") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onComplete(appointment.id)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                        title="Concluir consulta"
                      >
                        <FileCheck className="h-4 w-4" />
                      </Button>
                    )}
                    {(appointment.status === "SCHEDULED" ||
                      appointment.status === "CONFIRMED") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCancel(appointment.id)}
                        className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
                        title="Cancelar consulta"
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(appointment)}
                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                      title="Editar consulta"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(appointment.id, patient.name)}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      title="Excluir consulta"
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
                      <span className="font-medium text-slate-700">
                        {formatDate(appointment.date)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-slate-500" />
                      <span className="font-medium text-slate-700">
                        {appointment.time}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 text-xs text-slate-500 border-t border-slate-100">
                  <span>Agendado em {formatDate(appointment.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog
        open={!!appointmentToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setAppointmentToDelete(null);
          }
        }}
      >
        <DialogContent className="max-w-md bg-white">
          <button
            onClick={() => setAppointmentToDelete(null)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogHeader>
            <DialogTitle className="text-2xl text-slate-800">
              Confirmar exclusão
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Tem certeza que deseja excluir a consulta de{" "}
              <strong>{appointmentToDelete?.patientName}</strong>? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAppointmentToDelete(null)}
              className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-slate-800 hover:bg-slate-700 text-white"
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
