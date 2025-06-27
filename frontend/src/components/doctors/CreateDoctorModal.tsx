
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Doctor } from '@/types';

interface CreateDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (doctorData: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>) => void;
  selectedDoctor?: Doctor | null;
}

export const CreateDoctorModal = ({ isOpen, onClose, onSubmit, selectedDoctor }: CreateDoctorModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    specialty: '',
    crm: '',
    address: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (selectedDoctor) {
        setFormData({
          name: selectedDoctor.name,
          cpf: selectedDoctor.cpf,
          specialty: selectedDoctor.specialty,
          crm: selectedDoctor.crm,
          address: selectedDoctor.address
        });
      } else {
        setFormData({ name: '', cpf: '', specialty: '', crm: '', address: '' });
      }
    }
  }, [isOpen, selectedDoctor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', cpf: '', specialty: '', crm: '', address: '' });
    onClose();
  };

  const handleClose = () => {
    setFormData({ name: '', cpf: '', specialty: '', crm: '', address: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-800">
            {selectedDoctor ? 'Editar Médico' : 'Cadastrar Novo Médico'}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            {selectedDoctor ? 'Atualize os dados do médico' : 'Preencha os dados do novo médico'}
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialty" className="text-sm font-medium text-slate-700">Especialidade *</Label>
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                placeholder="Ex: Cardiologia"
                required
                className="h-11 border-slate-300 focus:border-teal-500 bg-white text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crm" className="text-sm font-medium text-slate-700">CRM *</Label>
              <Input
                id="crm"
                value={formData.crm}
                onChange={(e) => setFormData({...formData, crm: e.target.value})}
                placeholder="CRM/SP 123456"
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
              {selectedDoctor ? 'Atualizar Médico' : 'Cadastrar Médico'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
