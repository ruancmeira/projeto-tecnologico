
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User } from '@/types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const CreateUserModal = ({ isOpen, onClose, onSubmit }: CreateUserModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', email: '', password: '' });
    onClose();
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', password: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-800">
            Cadastrar Novo Usuário
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Preencha os dados do novo usuário
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
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-slate-700">Senha *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Digite a senha"
              required
              className="h-11 border-slate-300 focus:border-teal-500 bg-white text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={handleClose} className="border-slate-300 text-slate-700 hover:bg-slate-100">
              Cancelar
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white border-0">
              Cadastrar Usuário
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
