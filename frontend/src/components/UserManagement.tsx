import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { User } from "@/types";
import { UserCog, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { UserForm, UserFormData } from "./users/UserForm";
import { UserList } from "./users/UserList";
import { UserProfile } from "./users/UserProfile";
import { CreateUserModal } from "./users/CreateUserModal";
import { useUsers } from "@/hooks/useUsers";

export const UserManagement = () => {
  const { users, loading, getUserById, createUser, updateUser, deleteUser } =
    useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (formData: UserFormData) => {
    if (selectedUser) {
      const success = await updateUser(selectedUser.id, formData);
      if (success) {
        setIsDialogOpen(false);
        setSelectedUser(null);
      }
    }
  };

  const handleCreateSubmit = async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    const success = await createUser(userData);
    if (success) {
      setIsCreateModalOpen(false);
    }
    return success;
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleView = async (user: User) => {
    
    const updatedUser = await getUserById(user.id);
    if (updatedUser) {
      setViewingUser(updatedUser);
      setIsProfileOpen(true);
    }
  };

  const handleDelete = (userId: number, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
  };

  const confirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (userToDelete && !isDeleting) {
      setIsDeleting(true);
      const success = await deleteUser(userToDelete.id, userToDelete.name);
      setIsDeleting(false);
      if (success) {
        setUserToDelete(null);
      }
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  if (loading && users.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">USUÁRIOS</h1>
            <p className="text-slate-600 font-medium mt-2">
              Gerencie usuários do sistema
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-600">Carregando usuários...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">USUÁRIOS</h1>
          <p className="text-slate-600 font-medium mt-2">
            Gerencie usuários do sistema
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 text-white"
          disabled={loading || isDeleting}
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
        loading={loading || isDeleting}
      />

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <UserForm
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleSubmit}
          selectedUser={selectedUser}
          loading={loading || isDeleting}
        />
      </Dialog>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        loading={loading || isDeleting}
      />

      <UserProfile
        user={viewingUser}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <Dialog
        open={!!userToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setUserToDelete(null);
          }
        }}
      >
        <DialogContent className="max-w-md bg-white">
          <button
            onClick={() => !isDeleting && setUserToDelete(null)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500"
            disabled={isDeleting}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogHeader>
            <DialogTitle className="text-2xl text-slate-800">
              Confirmar exclusão
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Tem certeza que deseja excluir o usuário{" "}
              <strong>{userToDelete?.name}</strong>? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => !isDeleting && setUserToDelete(null)}
              disabled={isDeleting}
              className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-slate-800 hover:bg-slate-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
