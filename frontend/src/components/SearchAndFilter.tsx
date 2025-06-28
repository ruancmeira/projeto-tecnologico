
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { mockPatients, mockDoctors, mockAppointments } from '@/data/mockData';
import { Search } from 'lucide-react';

export const SearchAndFilter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredResults = () => {
    let results: any[] = [];

    if (searchType === 'all' || searchType === 'patients') {
      const patientResults = mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.cpf.includes(searchTerm)
      ).map(patient => ({ ...patient, type: 'patient' }));
      results = [...results, ...patientResults];
    }

    if (searchType === 'all' || searchType === 'doctors') {
      const doctorResults = mockDoctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.crm.toLowerCase().includes(searchTerm.toLowerCase())
      ).map(doctor => ({ ...doctor, type: 'doctor' }));
      results = [...results, ...doctorResults];
    }

    if (searchType === 'all' || searchType === 'appointments') {
      let appointmentResults = mockAppointments.filter(appointment => {
        const patient = mockPatients.find(p => p.id === appointment.patientId);
        const doctor = mockDoctors.find(d => d.id === appointment.doctorId);
        const patientName = patient?.name || '';
        const doctorName = doctor?.name || '';
        
        return patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               doctorName.toLowerCase().includes(searchTerm.toLowerCase());
      });

      if (dateFilter) {
        appointmentResults = appointmentResults.filter(appointment =>
          new Date(appointment.date).toISOString().split('T')[0] === dateFilter
        );
      }

      if (statusFilter !== 'all') {
        appointmentResults = appointmentResults.filter(appointment =>
          appointment.status === statusFilter
        );
      }

      results = [...results, ...appointmentResults.map(appointment => ({ ...appointment, type: 'appointment' }))];
    }

    return results;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSearchType('all');
    setDateFilter('');
    setStatusFilter('all');
  };

  const results = filteredResults();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Pesquisa e Filtros</h1>
        <p className="text-slate-600">Encontre informações rapidamente</p>
      </div>

      
      <Card className="border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Search className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search" className="text-slate-700">Termo de Pesquisa</Label>
              <Input
                id="search"
                placeholder="Digite sua pesquisa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-slate-300 focus:border-teal-500"
              />
            </div>
            
            <div>
              <Label htmlFor="searchType" className="text-slate-700">Tipo de Busca</Label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="border-slate-300 focus:border-teal-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="patients">Pacientes</SelectItem>
                  <SelectItem value="doctors">Médicos</SelectItem>
                  <SelectItem value="appointments">Consultas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateFilter" className="text-slate-700">Data (Consultas)</Label>
              <Input
                id="dateFilter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border-slate-300 focus:border-teal-500"
              />
            </div>

            <div>
              <Label htmlFor="statusFilter" className="text-slate-700">Status (Consultas)</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-slate-300 focus:border-teal-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="SCHEDULED">Agendado</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                  <SelectItem value="COMPLETED">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={clearFilters} className="border-slate-300 text-slate-700 hover:bg-slate-50">
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800">
            Resultados ({results.length})
          </h2>
        </div>

        {results.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-8 text-center">
              <p className="text-slate-600">Nenhum resultado encontrado</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {results.map((item, index) => (
              <Card key={`${item.type}-${item.id}-${index}`} className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  {item.type === 'patient' && (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900">{item.name}</h3>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            PACIENTE
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p><strong className="text-slate-700">Email:</strong> <span className="text-slate-900">{item.email}</span></p>
                        <p><strong className="text-slate-700">Telefone:</strong> <span className="text-slate-900">{item.phone}</span></p>
                        <p><strong className="text-slate-700">CPF:</strong> <span className="text-slate-900">{item.cpf}</span></p>
                        <p><strong className="text-slate-700">Nascimento:</strong> <span className="text-slate-900">{new Date(item.birthDate).toLocaleDateString('pt-BR')}</span></p>
                      </div>
                    </div>
                  )}

                  {item.type === 'doctor' && (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900">{item.name}</h3>
                          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                            MÉDICO
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p><strong className="text-slate-700">Especialidade:</strong> <span className="text-slate-900">{item.specialty}</span></p>
                        <p><strong className="text-slate-700">CRM:</strong> <span className="text-slate-900">{item.crm}</span></p>
                        <p><strong className="text-slate-700">CPF:</strong> <span className="text-slate-900">{item.cpf}</span></p>
                        <p><strong className="text-slate-700">Endereço:</strong> <span className="text-slate-900">{item.address}</span></p>
                      </div>
                    </div>
                  )}

                  {item.type === 'appointment' && (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900">
                            {mockPatients.find(p => p.id === item.patientId)?.name || 'Paciente'} → Dr(a). {mockDoctors.find(d => d.id === item.doctorId)?.name || 'Médico'}
                          </h3>
                          <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">
                            CONSULTA
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                          item.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p><strong className="text-slate-700">Data:</strong> <span className="text-slate-900">{new Date(item.date).toLocaleDateString('pt-BR')}</span></p>
                        <p><strong className="text-slate-700">Horário:</strong> <span className="text-slate-900">{item.time}</span></p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
