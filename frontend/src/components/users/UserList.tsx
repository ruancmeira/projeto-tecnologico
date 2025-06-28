import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { Edit, Trash2, Eye } from "lucide-react";

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  onDelete: (userId: number, userName: string) => void;
  loading?: boolean;
}

const SkeletonCard = () => (
  <Card className="border border-slate-200 bg-white shadow-sm rounded-xl overflow-hidden">
    <CardContent className="p-6">
      <div className="space-y-4">
        <div>
          <div className="h-6 bg-slate-100 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-slate-100 rounded animate-pulse w-2/3"></div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-9 bg-slate-100 rounded animate-pulse"></div>
          <div className="flex-1 h-9 bg-slate-100 rounded animate-pulse"></div>
          <div className="h-9 w-12 bg-slate-100 rounded animate-pulse"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const UserList = ({
  users,
  onEdit,
  onView,
  onDelete,
  loading = false,
}: UserListProps) => {
  if (loading && users.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (users.length === 0 && !loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-500">Nenhum usuário encontrado.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <Card
          key={user.id}
          className="border border-slate-200 bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {user.name}
                </h3>
                <p className="text-slate-500 font-medium">{user.email}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(user)}
                  className="flex-1 bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  disabled={loading}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(user)}
                  className="flex-1 bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  disabled={loading}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(user.id, user.name)}
                  className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  disabled={loading}
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
