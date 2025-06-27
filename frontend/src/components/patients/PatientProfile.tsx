
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Patient } from '@/types';
import { User, Mail, Phone, Calendar, MapPin } from 'lucide-react';

interface PatientProfileProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PatientProfile = ({ patient, isOpen, onClose }: PatientProfileProps) => {
  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-900 flex items-center gap-2">
            <User className="h-6 w-6 text-teal-600" />
            Perfil do Paciente
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{patient.name}</h3>
                <p className="text-sm text-slate-600">CPF: {patient.cpf}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-600">Email</p>
                    <p className="text-slate-900">{patient.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-600">Telefone</p>
                    <p className="text-slate-900">{patient.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-600">Data de Nascimento</p>
                    <p className="text-slate-900">
                      {new Date(patient.birthDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-slate-600">Endereço</p>
                    <p className="text-slate-900">{patient.address}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-600" />
                <div>
                  <p className="text-sm font-medium text-slate-600">Cadastrado em</p>
                  <p className="text-slate-900">
                    {new Date(patient.createdAt).toLocaleDateString('pt-BR')}
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
