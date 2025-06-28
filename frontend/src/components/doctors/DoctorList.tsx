import { Doctor } from "@/types";
import { Button } from "@/components/ui/button";
import { Stethoscope, Eye, Pencil, Trash2 } from "lucide-react";

interface DoctorListProps {
  doctors: Doctor[];
  onEdit: (doctor: Doctor) => void;
  onView: (doctor: Doctor) => void;
  onDelete: (id: number, name: string) => void;
  loading?: boolean;
}

export const DoctorList = ({
  doctors,
  onEdit,
  onView,
  onDelete,
  loading = false,
}: DoctorListProps) => {
  if (doctors.length === 0 && !loading) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-300 rounded-lg bg-slate-50">
        <Stethoscope className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-700 mb-2">
          Nenhum médico cadastrado
        </h3>
        <p className="text-slate-500">
          Clique no botão "Novo Médico" para cadastrar o primeiro médico no
          sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {doctors.map((doctor) => (
        <div
          key={doctor.id}
          className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">
                Dr(a). {doctor.name}
              </h3>
              <p className="text-sm text-slate-600">{doctor.specialty}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm mb-4">
            <p>
              <span className="font-medium text-slate-700">CRM:</span>{" "}
              {doctor.crm}
            </p>
            <p>
              <span className="font-medium text-slate-700">CPF:</span>{" "}
              {doctor.cpf}
            </p>
            <p>
              <span className="font-medium text-slate-700">Endereço:</span>{" "}
              {doctor.address}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(doctor)}
              className="text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              disabled={loading}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(doctor)}
              className="text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              disabled={loading}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(doctor.id, doctor.name)}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              disabled={loading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
