import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Patient } from "@/types";
import { User, Mail, Phone, Calendar, MapPin, FileText, X } from "lucide-react";

interface PatientProfileProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PatientProfile = ({
  patient,
  isOpen,
  onClose,
}: PatientProfileProps) => {
  if (!patient) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none bg-white hover:bg-slate-50 text-slate-500"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-800">
            Perfil do Paciente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-slate-800">{patient.name}</h3>
            <p className="text-sm text-slate-500">
              CPF: <span className="text-slate-700">{patient.cpf}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Email</p>
                  <p className="text-slate-700">{patient.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Telefone</p>
                  <p className="text-slate-700">{patient.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Data de Nascimento
                  </p>
                  <p className="text-slate-700">
                    {formatDate(patient.birthDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-slate-100 p-2 rounded-full mt-1">
                  <MapPin className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Endereço</p>
                  <p className="text-slate-700">{patient.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Cadastrado em
                  </p>
                  <p className="text-slate-700">
                    {formatDate(patient.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Última atualização
                  </p>
                  <p className="text-slate-700">
                    {formatDate(patient.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
