
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types';
import { Edit, User, Calendar, X } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: number, patientName: string) => void;
}

export const PatientCard = ({ patient, onEdit, onDelete }: PatientCardProps) => {
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border border-slate-300 shadow-md hover:-translate-y-1 bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-slate-900 group-hover:text-teal-600 transition-colors">
                {patient.name}
              </CardTitle>
              <p className="text-sm text-slate-700 flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                {calculateAge(patient.birthDate)} anos
              </p>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(patient)}
              className="h-8 w-8 p-0 hover:bg-teal-100 hover:text-teal-600"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(patient.id, patient.name)}
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="font-medium text-slate-800 w-16">Email:</span>
            <span className="text-slate-900">{patient.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium text-slate-800 w-16">Fone:</span>
            <span className="text-slate-900">{patient.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium text-slate-800 w-16">CPF:</span>
            <span className="text-slate-900">{patient.cpf}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 text-xs text-slate-600 border-t border-slate-200">
          <span>Cadastrado em {new Date(patient.createdAt).toLocaleDateString('pt-BR')}</span>
        </div>
      </CardContent>
    </Card>
  );
};
