import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Doctor } from "@/types";
import {
  User,
  FileText,
  Stethoscope,
  MapPin,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface DoctorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: DoctorFormData) => void;
  selectedDoctor: Doctor | null;
  loading?: boolean;
}

export interface DoctorFormData {
  name: string;
  cpf: string;
  specialty: string;
  crm: string;
  address: string;
}

export const DoctorForm = ({
  isOpen,
  onClose,
  onSubmit,
  selectedDoctor,
  loading = false,
}: DoctorFormProps) => {
  const [formData, setFormData] = useState<DoctorFormData>({
    name: "",
    cpf: "",
    specialty: "",
    crm: "",
    address: "",
  });
  const [errors, setErrors] = useState<{
    name?: boolean | string;
    cpf?: boolean | string;
    specialty?: boolean | string;
    crm?: boolean | string;
    address?: boolean | string;
  }>({});

  
  useEffect(() => {
    if (isOpen && selectedDoctor) {
      setFormData({
        name: selectedDoctor.name || "",
        cpf: selectedDoctor.cpf || "",
        specialty: selectedDoctor.specialty || "",
        crm: selectedDoctor.crm || "",
        address: selectedDoctor.address || "",
      });
      setErrors({});
    }
  }, [isOpen, selectedDoctor]);

  const validate = () => {
    const newErrors: {
      name?: boolean | string;
      cpf?: boolean | string;
      specialty?: boolean | string;
      crm?: boolean | string;
      address?: boolean | string;
    } = {};

    if (!formData.name) {
      newErrors.name = "Campo obrigatório";
    }

    if (!formData.cpf) {
      newErrors.cpf = "Campo obrigatório";
    }

    if (!formData.specialty) {
      newErrors.specialty = "Campo obrigatório";
    }

    if (!formData.crm) {
      newErrors.crm = "Campo obrigatório";
    }

    if (!formData.address) {
      newErrors.address = "Campo obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
  };

  
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); 
    let formattedValue = "";

    if (value.length > 0) {
      formattedValue = value.substring(0, 3);

      if (value.length > 3) {
        formattedValue += `.${value.substring(3, 6)}`;

        if (value.length > 6) {
          formattedValue += `.${value.substring(6, 9)}`;

          if (value.length > 9) {
            formattedValue += `-${value.substring(9, 11)}`;
          }
        }
      }
    }

    setFormData({ ...formData, cpf: formattedValue });
    if (errors.cpf) setErrors({ ...errors, cpf: false });
  };

  return (
    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
      <DialogHeader>
        <DialogTitle className="text-2xl text-slate-800">
          Editar Médico
        </DialogTitle>
        <DialogDescription className="text-slate-500">
          Atualize as informações do médico
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: false });
                }}
                placeholder="Nome completo"
                className={`pl-10 py-5 bg-white text-slate-800 rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-slate-400 ${
                  errors.name
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                    : "border-slate-200 focus-visible:border-slate-400 focus-visible:ring-slate-400"
                }`}
                disabled={loading}
              />
            </div>
            {errors.name && (
              <div className="flex items-center text-red-500 text-xs mt-1 ml-1">
                <AlertCircle size={12} className="mr-1" />
                <span>
                  {typeof errors.name === "string"
                    ? errors.name
                    : "Campo obrigatório"}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <FileText size={18} />
              </div>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                maxLength={14}
                className={`pl-10 py-5 bg-white text-slate-800 rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-slate-400 ${
                  errors.cpf
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                    : "border-slate-200 focus-visible:border-slate-400 focus-visible:ring-slate-400"
                }`}
                disabled={loading}
              />
            </div>
            {errors.cpf && (
              <div className="flex items-center text-red-500 text-xs mt-1 ml-1">
                <AlertCircle size={12} className="mr-1" />
                <span>
                  {typeof errors.cpf === "string"
                    ? errors.cpf
                    : "Campo obrigatório"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Stethoscope size={18} />
              </div>
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) => {
                  setFormData({ ...formData, specialty: e.target.value });
                  if (errors.specialty)
                    setErrors({ ...errors, specialty: false });
                }}
                placeholder="Especialidade"
                className={`pl-10 py-5 bg-white text-slate-800 rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-slate-400 ${
                  errors.specialty
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                    : "border-slate-200 focus-visible:border-slate-400 focus-visible:ring-slate-400"
                }`}
                disabled={loading}
              />
            </div>
            {errors.specialty && (
              <div className="flex items-center text-red-500 text-xs mt-1 ml-1">
                <AlertCircle size={12} className="mr-1" />
                <span>
                  {typeof errors.specialty === "string"
                    ? errors.specialty
                    : "Campo obrigatório"}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <FileText size={18} />
              </div>
              <Input
                id="crm"
                value={formData.crm}
                onChange={(e) => {
                  setFormData({ ...formData, crm: e.target.value });
                  if (errors.crm) setErrors({ ...errors, crm: false });
                }}
                placeholder="CRM/UF 000000"
                className={`pl-10 py-5 bg-white text-slate-800 rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-slate-400 ${
                  errors.crm
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                    : "border-slate-200 focus-visible:border-slate-400 focus-visible:ring-slate-400"
                }`}
                disabled={loading}
              />
            </div>
            {errors.crm && (
              <div className="flex items-center text-red-500 text-xs mt-1 ml-1">
                <AlertCircle size={12} className="mr-1" />
                <span>
                  {typeof errors.crm === "string"
                    ? errors.crm
                    : "Campo obrigatório"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <MapPin size={18} />
            </div>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => {
                setFormData({ ...formData, address: e.target.value });
                if (errors.address) setErrors({ ...errors, address: false });
              }}
              placeholder="Endereço completo"
              className={`pl-10 py-5 bg-white text-slate-800 rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-slate-400 ${
                errors.address
                  ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                  : "border-slate-200 focus-visible:border-slate-400 focus-visible:ring-slate-400"
              }`}
              disabled={loading}
            />
          </div>
          {errors.address && (
            <div className="flex items-center text-red-500 text-xs mt-1 ml-1">
              <AlertCircle size={12} className="mr-1" />
              <span>
                {typeof errors.address === "string"
                  ? errors.address
                  : "Campo obrigatório"}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-slate-800 hover:bg-slate-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Atualizando...</span>
              </div>
            ) : (
              "Atualizar"
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};
