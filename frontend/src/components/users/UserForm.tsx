import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { User } from "@/types";
import {
  Loader2,
  Mail,
  User as UserIcon,
  Lock,
  AlertCircle,
} from "lucide-react";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: UserFormData) => void;
  selectedUser: User | null;
  loading?: boolean;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
}

export const UserForm = ({
  isOpen,
  onClose,
  onSubmit,
  selectedUser,
  loading = false,
}: UserFormProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    name?: boolean | string;
    email?: boolean | string;
    password?: boolean | string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      if (selectedUser) {
        setFormData({
          name: selectedUser.name || "",
          email: selectedUser.email || "",
          password: "",
        });
        setErrors({});
      } else {
        setFormData({
          name: "",
          email: "",
          password: "",
        });
        setErrors({});
      }
    }
  }, [isOpen, selectedUser]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = () => {
    const newErrors: {
      name?: boolean | string;
      email?: boolean | string;
      password?: boolean | string;
    } = {};

    if (!formData.name) {
      newErrors.name = "Campo obrigatório";
    }

    if (!formData.email) {
      newErrors.email = "Campo obrigatório";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (
      formData.password &&
      formData.password.length > 0 &&
      formData.password.length < 6
    ) {
      newErrors.password = "A senha deve ter no mínimo 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Se a senha estiver vazia, não a enviamos na atualização
    const dataToSubmit = { ...formData };
    if (!dataToSubmit.password) {
      delete dataToSubmit.password;
    }

    onSubmit(dataToSubmit);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-800">
            {selectedUser ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {selectedUser
              ? "Atualize as informações do usuário"
              : "Preencha os dados do usuário"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Nome completo */}
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <UserIcon size={18} />
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

          {/* Email */}
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

          {/* Senha (opcional para edição) */}
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <Input
                id="password"
                type="password"
                value={formData.password || ""}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password)
                    setErrors({ ...errors, password: false });
                }}
                placeholder={selectedUser ? "Nova senha (opcional)" : "Senha"}
                className={`pl-10 py-5 bg-white text-slate-800 rounded-lg focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-slate-400 ${
                  errors.password
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                    : "border-slate-200 focus-visible:border-slate-400 focus-visible:ring-slate-400"
                }`}
              />
            </div>
            {errors.password && (
              <div className="flex items-center text-red-500 text-xs mt-1 ml-1">
                <AlertCircle size={12} className="mr-1" />
                <span>
                  {typeof errors.password === "string"
                    ? errors.password
                    : "Campo inválido"}
                </span>
              </div>
            )}
            {selectedUser && (
              <div className="text-xs text-slate-500 mt-1 ml-1">
                Deixe em branco para manter a senha atual
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
                  <span>
                    {selectedUser ? "Atualizando..." : "Cadastrando..."}
                  </span>
                </div>
              ) : selectedUser ? (
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
