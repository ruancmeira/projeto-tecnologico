
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Patient } from '@/types';

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const CreatePatientModal = ({ isOpen, onClose, onSubmit }: CreatePatientModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    birthDate: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', cpf: '', birthDate: '', phone: '', email: '', address: '' });
    onClose();
  };

  const handleClose = () => {
    setFormData({ name: '', cpf: '', birthDate: '', phone: '', email: '', address: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-800">
            Cadastrar Novo Paciente
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Preencha os dados do novo paciente
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Digite o nome completo"
                required
                className="h-11 border-slate-300 focus:border-teal-500 bg-white text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="exemplo@email.com"
                required
                className="h-11 border-slate-300 focus:border-teal-500 bg-white text-slate-900"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(11) 99999-9999"
                required
                className="h-11 border-slate-300 focus:border-teal-500 bg-white text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-sm font-medium text-slate-700">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                placeholder="000.000.000-00"
                required
                className="h-11 border-slate-300 focus:border-teal-500 bg-white text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-sm font-medium text-slate-700">Data de Nascimento *</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                required
                className="h-11 border-slate-300 focus:border-teal-500 bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-slate-700">Endereço Completo *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Rua, número, bairro, cidade, estado, CEP"
              required
              className="h-11 border-slate-300 focus:border-teal-500 bg-white text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={handleClose} className="border-slate-300 text-slate-700 hover:bg-slate-100">
              Cancelar
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white border-0">
              Cadastrar Paciente
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
