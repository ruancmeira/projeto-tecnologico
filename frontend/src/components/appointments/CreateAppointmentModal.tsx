import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Appointment, Patient, Doctor } from "@/types";
import { toast } from "@/components/ui/sonner";
import {
  AlertCircle,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Loader2,
} from "lucide-react";

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    appointmentData: Omit<Appointment, "id" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  patients: Patient[];
  doctors: Doctor[];
  selectedAppointment?: Appointment | null;
  isLoading?: boolean;
}

export const CreateAppointmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  patients,
  doctors,
  selectedAppointment,
  isLoading = false,
}: CreateAppointmentModalProps) => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    status: "SCHEDULED" as
      | "SCHEDULED"
      | "CONFIRMED"
      | "CANCELLED"
      | "COMPLETED",
    patientId: 0,
    doctorId: 0,
  });

  const [errors, setErrors] = useState({
    date: "",
    time: "",
    patientId: "",
    doctorId: "",
  });

  
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (selectedAppointment) {
        const appointmentDate = new Date(selectedAppointment.date);
        const dateString = appointmentDate.toISOString().split("T")[0];

        setFormData({
          date: dateString,
          time: selectedAppointment.time,
          status: selectedAppointment.status,
          patientId: selectedAppointment.patientId,
          doctorId: selectedAppointment.doctorId,
        });
        
        setErrors({
          date: "",
          time: "",
          patientId: "",
          doctorId: "",
        });
        setFormSubmitted(false);
      } else {
        setFormData({
          date: "",
          time: "",
          status: "SCHEDULED",
          patientId: 0,
          doctorId: 0,
        });
        setErrors({
          date: "",
          time: "",
          patientId: "",
          doctorId: "",
        });
        setFormSubmitted(false);
      }
    }
  }, [isOpen, selectedAppointment]);

  
  useEffect(() => {
    if (formSubmitted) {
      validateForm();
    }
  }, [formData, formSubmitted]);

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      date: "",
      time: "",
      patientId: "",
      doctorId: "",
    };

    
    if (!formData.date) {
      newErrors.date = "Campo obrigatório";
      isValid = false;
    }

    
    if (!formData.time) {
      newErrors.time = "Campo obrigatório";
      isValid = false;
    }

    
    if (!formData.patientId) {
      newErrors.patientId = "Selecione um paciente";
      isValid = false;
    }

    
    if (!formData.doctorId) {
      newErrors.doctorId = "Selecione um médico";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
    setFormSubmitted(true);

    
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    
    const appointmentDate = new Date(formData.date + "T" + formData.time);

    
    const appointmentData = {
      date: appointmentDate.toISOString(),
      time: formData.time,
      patientId: formData.patientId,
      doctorId: formData.doctorId,
      
      
      status: selectedAppointment ? formData.status : ("SCHEDULED" as const),
    };

    const success = await onSubmit(appointmentData);

    
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      date: "",
      time: "",
      status: "SCHEDULED",
      patientId: 0,
      doctorId: 0,
    });
    setErrors({
      date: "",
      time: "",
      patientId: "",
      doctorId: "",
    });
    setFormSubmitted(false);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-800">
            {selectedAppointment
              ? "Editar Consulta"
              : "Cadastrar Nova Consulta"}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {selectedAppointment
              ? "Atualize os dados da consulta"
              : "Preencha os dados da nova consulta"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Calendar size={18} />
              </div>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  if (formSubmitted) {
                    
                    if (e.target.value) {
                      setErrors({ ...errors, date: "" });
                    } else {
                      setErrors({ ...errors, date: "Campo obrigatório" });
                    }
                  }
                }}
                required
                className={`pl-10 py-5 bg-white text-slate-800 rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-slate-400 ${
                  errors.date
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                    : "border-slate-200 focus-visible:border-slate-400 focus-visible:ring-slate-400"
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.date && (
              <div className="flex items-center text-red-500 text-xs mt-1 ml-1">
                <AlertCircle size={12} className="mr-1" />
                <span>{errors.date}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Clock size={18} />
              </div>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => {
                  setFormData({ ...formData, time: e.target.value });
                  if (formSubmitted) {
                    
                    if (e.target.value) {
                      setErrors({ ...errors, time: "" });
                    } else {
                      setErrors({ ...errors, time: "Campo obrigatório" });
                    }
                  }
                }}
                required
                className={`pl-10 py-5 bg-white text-slate-800 rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-slate-400 ${
                  errors.time
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                    : "border-slate-200 focus-visible:border-slate-400 focus-visible:ring-slate-400"
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.time && (
              <div className="flex items-center text-red-500 text-xs mt-1 ml-1">
                <AlertCircle size={12} className="mr-1" />
                <span>{errors.time}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 z-10">
                <User size={18} />
              </div>
              <Select
                value={formData.patientId ? formData.patientId.toString() : ""}
                onValueChange={(value) => {
                  setFormData({ ...formData, patientId: parseInt(value) });
                  if (formSubmitted) {
                    
                    setErrors({ ...errors, patientId: "" });
                  }
                }}
                disabled={isLoading}
              >
                <SelectTrigger
                  className={`pl-10 py-5 h-11 bg-white text-slate-800 rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 hover:bg-white ${
                    errors.patientId
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                      : "border-slate-200 focus-visible:border-slate-400 focus-visible:ring-slate-400"
                  }`}
                >
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  {patients.map((patient) => (
                    <SelectItem
                      key={patient.id}
                      value={patient.id.toString()}
                      className="hover:bg-slate-100"
                    >
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.patientId && (
              <div className="flex items-center text-red-500 text-xs mt-1 ml-1">
                <AlertCircle size={12} className="mr-1" />
                <span>{errors.patientId}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 z-10">
                <Stethoscope size={18} />
              </div>
              <Select
                value={formData.doctorId ? formData.doctorId.toString() : ""}
                onValueChange={(value) => {
                  setFormData({ ...formData, doctorId: parseInt(value) });
                  if (formSubmitted) {
                    
                    setErrors({ ...errors, doctorId: "" });
                  }
                }}
                disabled={isLoading}
              >
                <SelectTrigger
                  className={`pl-10 py-5 h-11 bg-white text-slate-800 rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 hover:bg-white ${
                    errors.doctorId
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                      : "border-slate-200 focus-visible:border-slate-400 focus-visible:ring-slate-400"
                  }`}
                >
                  <SelectValue placeholder="Selecione o médico" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  {doctors.map((doctor) => (
                    <SelectItem
                      key={doctor.id}
                      value={doctor.id.toString()}
                      className="hover:bg-slate-100"
                    >
                      Dr(a). {doctor.name} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.doctorId && (
              <div className="flex items-center text-red-500 text-xs mt-1 ml-1">
                <AlertCircle size={12} className="mr-1" />
                <span>{errors.doctorId}</span>
              </div>
            )}
          </div>

          {selectedAppointment && (
            <div className="space-y-1">
              <Label
                htmlFor="status"
                className="text-sm font-medium text-slate-700"
              >
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(
                  value: "SCHEDULED" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
                ) => setFormData({ ...formData, status: value })}
                disabled={isLoading}
              >
                <SelectTrigger className="h-11 bg-white text-slate-800 rounded-lg border-slate-200 focus-visible:border-slate-400 focus-visible:ring-slate-400 focus-visible:ring-1 focus-visible:ring-offset-0 hover:bg-white">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="SCHEDULED" className="hover:bg-slate-100">
                    Agendado
                  </SelectItem>
                  <SelectItem value="CONFIRMED" className="hover:bg-slate-100">
                    Confirmado
                  </SelectItem>
                  <SelectItem value="CANCELLED" className="hover:bg-slate-100">
                    Cancelado
                  </SelectItem>
                  <SelectItem value="COMPLETED" className="hover:bg-slate-100">
                    Concluído
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-slate-800 hover:bg-slate-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>
                    {selectedAppointment ? "Atualizando..." : "Cadastrando..."}
                  </span>
                </div>
              ) : selectedAppointment ? (
                "Atualizar Consulta"
              ) : (
                "Cadastrar Consulta"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
