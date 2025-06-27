
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { Edit, Trash2, Eye } from 'lucide-react';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  onDelete: (userId: number, userName: string) => void;
}

export const UserList = ({ users, onEdit, onView, onDelete }: UserListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <Card key={user.id} className="border-2 border-slate-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                <p className="text-slate-700 font-medium">{user.email}</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(user)}
                  className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(user)}
                  className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(user.id, user.name)}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
