
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Edit, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AppointmentType {
  id: string;
  name: string;
  description: string;
  duration: number; // em minutos
  createdAt: string;
}

const defaultTypes: AppointmentType[] = [
  { id: '1', name: 'Consulta', description: 'Consulta médica padrão', duration: 30, createdAt: new Date().toISOString() },
  { id: '2', name: 'Exame', description: 'Exame médico', duration: 60, createdAt: new Date().toISOString() },
  { id: '3', name: 'Retorno', description: 'Consulta de retorno', duration: 20, createdAt: new Date().toISOString() },
  { id: '4', name: 'Emergência', description: 'Atendimento de emergência', duration: 45, createdAt: new Date().toISOString() },
];

export const AppointmentTypes = () => {
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>(defaultTypes);
  const [selectedType, setSelectedType] = useState<AppointmentType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: 30
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedType) {
      const updatedTypes = appointmentTypes.map(t => 
        t.id === selectedType.id 
          ? { ...t, ...formData }
          : t
      );
      setAppointmentTypes(updatedTypes);
      toast.success('Tipo de consulta atualizado com sucesso!');
    } else {
      const newType: AppointmentType = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setAppointmentTypes([...appointmentTypes, newType]);
      toast.success('Tipo de consulta criado com sucesso!');
    }

    setIsDialogOpen(false);
    resetForm();
    setSelectedType(null);
  };

  const handleEdit = (type: AppointmentType) => {
    setSelectedType(type);
    setFormData({
      name: type.name,
      description: type.description,
      duration: type.duration
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (typeId: string, typeName: string) => {
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o tipo "${typeName}"?`);
    if (confirmDelete) {
      setAppointmentTypes(appointmentTypes.filter(t => t.id !== typeId));
      toast.success('Tipo de consulta removido com sucesso!');
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
    setSelectedType(null);
  };

  const handleNewType = () => {
    setSelectedType(null);
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tipos de Consulta</h2>
          <p className="text-gray-800 font-medium">Configure os tipos de consulta disponíveis</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={handleNewType} className="bg-purple-600 hover:bg-purple-700 text-white border-0">
              <Plus className="h-4 w-4 mr-2" />
              Novo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl text-gray-900">
                {selectedType ? 'Editar Tipo de Consulta' : 'Criar Novo Tipo'}
              </DialogTitle>
              <DialogDescription className="text-gray-700">
                {selectedType ? 'Atualize as informações do tipo' : 'Preencha os dados do novo tipo'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-900">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nome do tipo de consulta"
                  required
                  className="border-gray-300 focus:border-purple-500 text-gray-900 bg-white"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-900">Descrição *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descrição do tipo de consulta"
                  required
                  className="border-gray-300 focus:border-purple-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <Label htmlFor="duration" className="text-sm font-medium text-gray-900">Duração (minutos) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="5"
                  max="300"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  required
                  className="border-gray-300 focus:border-purple-500 text-gray-900 bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                  {selectedType ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {appointmentTypes.map((type) => (
          <Card key={type.id} className="border-2 border-gray-300 bg-white shadow-lg hover:shadow-xl transition-shadow group">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-gray-900">{type.name}</CardTitle>
                  <p className="text-sm text-gray-700 font-medium">{type.description}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(type)}
                    className="h-8 w-8 p-0 hover:bg-purple-100 hover:text-purple-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(type.id, type.name)}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-800 font-medium">
                Duração: {type.duration} minutos
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
