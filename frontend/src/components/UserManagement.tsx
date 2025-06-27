
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { mockUsers } from '@/data/mockData';
import { User } from '@/types';
import { UserCog, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { UserForm, UserFormData } from './users/UserForm';
import { UserList } from './users/UserList';
import { UserProfile } from './users/UserProfile';
import { CreateUserModal } from './users/CreateUserModal';

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);

  const handleSubmit = (formData: UserFormData) => {
    if (selectedUser) {
      const updatedUsers = users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, ...formData, updatedAt: new Date().toISOString() }
          : u
      );
      setUsers(updatedUsers);
      toast.success('Usuário atualizado com sucesso!', {
        description: `${formData.name} foi atualizado no sistema.`
      });
    }

    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  const handleCreateSubmit = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUser: User = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUsers([...users, newUser]);
    toast.success('Usuário cadastrado com sucesso!', {
      description: `${userData.name} foi adicionado ao sistema.`
    });
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleView = (user: User) => {
    setViewingUser(user);
    setIsProfileOpen(true);
  };

  const handleDelete = (userId: number, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      toast.success('Usuário removido com sucesso!', {
        description: `${userToDelete.name} foi removido do sistema.`
      });
      setUserToDelete(null);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">USUÁRIOS</h1>
          <p className="text-slate-600 font-medium mt-2">Gerencie usuários do sistema</p>
        </div>
        
        <Button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white border-0"
        >
          <UserCog className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <UserList
        users={users}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <UserForm
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleSubmit}
          selectedUser={selectedUser}
        />
      </Dialog>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <UserProfile
        user={viewingUser}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário <strong>{userToDelete?.name}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
