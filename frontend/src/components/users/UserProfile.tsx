
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '@/types';
import { UserCog, Mail, Calendar } from 'lucide-react';

interface UserProfileProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfile = ({ user, isOpen, onClose }: UserProfileProps) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-900 flex items-center gap-2">
            <UserCog className="h-6 w-6 text-blue-600" />
            Perfil do Usuário
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-600">Email</p>
                    <p className="text-slate-900">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-600">Cadastrado em</p>
                    <p className="text-slate-900">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
