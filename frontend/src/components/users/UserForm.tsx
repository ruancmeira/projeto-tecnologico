
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User } from '@/types';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: UserFormData) => void;
  selectedUser: User | null;
}

export interface UserFormData {
  name: string;
  email: string;
}

export const UserForm = ({ isOpen, onClose, onSubmit, selectedUser }: UserFormProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (selectedUser) {
        setFormData({
          name: selectedUser.name || '',
          email: selectedUser.email || ''
        });
      } else {
        setFormData({
          name: '',
          email: ''
        });
      }
    }
  }, [isOpen, selectedUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-900">
            {selectedUser ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            {selectedUser ? 'Atualize as informações do usuário' : 'Preencha os dados do novo usuário'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-800">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Digite o nome completo"
                required
                className="h-11 border-slate-300 focus:border-blue-500 bg-white text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-800">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="exemplo@email.com"
                required
                className="h-11 border-slate-300 focus:border-blue-500 bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-300 text-slate-700 hover:bg-slate-100">
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
              {selectedUser ? 'Atualizar Usuário' : 'Cadastrar Usuário'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
