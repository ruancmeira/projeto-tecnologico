import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Patient } from "@/types";
import { Edit, Trash2, Eye, User } from "lucide-react";

interface PatientListProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onView: (patient: Patient) => void;
  onDelete: (patientId: number, patientName: string) => void;
  loading?: boolean;
}

const SkeletonCard = () => (
  <Card className="border border-slate-200 bg-white shadow-sm rounded-xl overflow-hidden">
    <CardContent className="p-6">
      <div className="space-y-4">
        <div>
          <div className="h-6 bg-slate-100 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-slate-100 rounded animate-pulse w-2/3"></div>
          <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2 mt-2"></div>
          <div className="h-4 bg-slate-100 rounded animate-pulse w-1/3 mt-2"></div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-9 bg-slate-100 rounded animate-pulse"></div>
          <div className="flex-1 h-9 bg-slate-100 rounded animate-pulse"></div>
          <div className="h-9 w-12 bg-slate-100 rounded animate-pulse"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const PatientList = ({
  patients,
  onEdit,
  onView,
  onDelete,
  loading = false,
}: PatientListProps) => {
  if (loading && patients.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (patients.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-700 mb-2">
          Nenhum paciente cadastrado
        </h3>
        <p className="text-slate-500">
          Comece cadastrando o primeiro paciente do sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {patients.map((patient) => (
        <Card
          key={patient.id}
          className="border border-slate-200 bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {patient.name}
                </h3>
                <p className="text-slate-500 font-medium">{patient.email}</p>
                <p className="text-sm text-slate-500">{patient.phone}</p>
                <p className="text-sm text-slate-500">CPF: {patient.cpf}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(patient)}
                  className="flex-1 bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  disabled={loading}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(patient)}
                  className="flex-1 bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  disabled={loading}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(patient.id, patient.name)}
                  className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  disabled={loading}
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
