import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Patient } from "@/types";
import {
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  MapPin,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface PatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: PatientFormData) => void;
  selectedPatient: Patient | null;
  loading?: boolean;
}

export interface PatientFormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  address: string;
}

export const PatientForm = ({
  isOpen,
  onClose,
  onSubmit,
  selectedPatient,
  loading = false,
}: PatientFormProps) => {
  const [formData, setFormData] = useState<PatientFormData>({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    birthDate: "",
    address: "",
  });
  const [errors, setErrors] = useState<{
    name?: boolean | string;
    email?: boolean | string;
    phone?: boolean | string;
    cpf?: boolean | string;
    birthDate?: boolean | string;
    address?: boolean | string;
  }>({});

  // Reset form when dialog opens/closes or selectedPatient changes
  useEffect(() => {
    if (isOpen) {
      if (selectedPatient) {
        // Format the date for the input element (YYYY-MM-DD)
        let formattedDate = "";
        try {
          if (selectedPatient.birthDate) {
            const date = new Date(selectedPatient.birthDate);
            formattedDate = date.toISOString().split("T")[0];
          }
        } catch (e) {
          formattedDate = selectedPatient.birthDate || "";
        }

        setFormData({
          name: selectedPatient.name || "",
          email: selectedPatient.email || "",
          phone: selectedPatient.phone || "",
          cpf: selectedPatient.cpf || "",
          birthDate: formattedDate,
          address: selectedPatient.address || "",
        });
        setErrors({});
      } else {
        setFormData({
          name: "",
          email: "",
          phone: "",
          cpf: "",
          birthDate: "",
          address: "",
        });
        setErrors({});
      }
    }
  }, [isOpen, selectedPatient]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = () => {
    const newErrors: {
      name?: boolean | string;
      email?: boolean | string;
      phone?: boolean | string;
      cpf?: boolean | string;
      birthDate?: boolean | string;
      address?: boolean | string;
    } = {};

    if (!formData.name) {
      newErrors.name = "Campo obrigatório";
    }

    if (!formData.email) {
      newErrors.email = "Campo obrigatório";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.phone) {
      newErrors.phone = "Campo obrigatório";
    }

    if (!formData.cpf) {
      newErrors.cpf = "Campo obrigatório";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Campo obrigatório";
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

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      cpf: "",
      birthDate: "",
      address: "",
    });
    onClose();
  };

  // Phone mask handler (format: (00) 00000-0000)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    let formattedValue = "";

    if (value.length > 0) {
      // Format with parentheses for the area code
      formattedValue = `(${value.substring(0, 2)}`;

      if (value.length > 2) {
        // Add closing parenthesis and space after area code
        formattedValue += `) ${value.substring(2, 7)}`;

        if (value.length > 7) {
          // Add hyphen before the last 4 digits
          formattedValue += `-${value.substring(7, 11)}`;
        }
      }
    }

    setFormData({ ...formData, phone: formattedValue });
    if (errors.phone) setErrors({ ...errors, phone: false });
  };

  // CPF mask handler (format: 000.000.000-00)
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-800">
            {selectedPatient ? "Editar Paciente" : "Cadastrar Novo Paciente"}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {selectedPatient
              ? "Atualize as informações do paciente"
              : "Preencha os dados do novo paciente"}
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
                  <Mail size={18} />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: false });
                  }}
                  placeholder="Email"
                  className={`pl-10 py-5 bg-white text-slate-800 rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-slate-400 ${
                    errors.email
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                      : "border-slate-200 focus-visible:border-slate-400 focus-visible:ring-slate-400"
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <div className="flex items-center text-red-500 text-xs mt-1 ml-1">
                  <AlertCircle size={12} className="mr-1" />
                  <span>
                    {typeof errors.email === "string"
                      ? errors.email
                      : "Campo obrigatório"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Phone size={18} />
                </div>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  className={`pl-10 py-5 bg-white text-slate-800 rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-slate-400 ${
                    errors.phone
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                      : "border-slate-200 focus-visible:border-slate-400 focus-visible:ring-slate-400"
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.phone && (
                <div className="flex items-center text-red-500 text-xs mt-1 ml-1">
                  <AlertCircle size={12} className="mr-1" />
                  <span>
                    {typeof errors.phone === "string"
                      ? errors.phone
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
            <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Calendar size={18} />
                </div>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => {
                    setFormData({ ...formData, birthDate: e.target.value });
                    if (errors.birthDate)
                      setErrors({ ...errors, birthDate: false });
                  }}
                  className={`pl-10 py-5 bg-white text-slate-800 rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-slate-400 ${
                    errors.birthDate
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                      : "border-slate-200 focus-visible:border-slate-400 focus-visible:ring-slate-400"
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.birthDate && (
                <div className="flex items-center text-red-500 text-xs mt-1 ml-1">
                  <AlertCircle size={12} className="mr-1" />
                  <span>
                    {typeof errors.birthDate === "string"
                      ? errors.birthDate
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
              onClick={handleClose}
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
                  <span>
                    {selectedPatient ? "Atualizando..." : "Cadastrando..."}
                  </span>
                </div>
              ) : selectedPatient ? (
                "Atualizar"
              ) : (
                "Cadastrar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
