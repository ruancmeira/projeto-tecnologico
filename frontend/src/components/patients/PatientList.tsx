
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types';
import { Edit, Trash2, Eye } from 'lucide-react';

interface PatientListProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onView: (patient: Patient) => void;
  onDelete: (patientId: number, patientName: string) => void;
}

export const PatientList = ({ patients, onEdit, onView, onDelete }: PatientListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {patients.map((patient) => (
        <Card key={patient.id} className="border-2 border-slate-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{patient.name}</h3>
                <p className="text-slate-700 font-medium">{patient.email}</p>
                <p className="text-sm text-slate-600">{patient.phone}</p>
                <p className="text-sm text-slate-600">CPF: {patient.cpf}</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(patient)}
                  className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(patient)}
                  className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(patient.id, patient.name)}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
