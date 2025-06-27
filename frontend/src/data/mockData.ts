
import { Patient, Doctor, Appointment, User } from '@/types';

export const mockPatients: Patient[] = [
  {
    id: 1,
    name: 'Maria Silva Santos',
    cpf: '123.456.789-01',
    birthDate: '1985-03-15',
    phone: '(11) 99999-1234',
    email: 'maria.silva@email.com',
    address: 'Rua das Flores, 123, Centro, São Paulo, SP, 01000-000',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'João Pedro Oliveira',
    cpf: '987.654.321-09',
    birthDate: '1990-07-22',
    phone: '(11) 98888-5678',
    email: 'joao.pedro@email.com',
    address: 'Av. Paulista, 456, Bela Vista, São Paulo, SP, 01310-000',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  },
  {
    id: 3,
    name: 'Ana Carolina Lima',
    cpf: '456.789.123-45',
    birthDate: '1988-12-10',
    phone: '(11) 97777-9012',
    email: 'ana.lima@email.com',
    address: 'Rua Augusta, 789, Consolação, São Paulo, SP, 01305-000',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Carlos Alberto Mendes',
    cpf: '111.222.333-44',
    specialty: 'Cardiologia',
    crm: 'CRM/SP 123456',
    address: 'Rua dos Médicos, 100, Jardins, São Paulo, SP, 01400-000',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 2,
    name: 'Dra. Fernanda Costa Silva',
    cpf: '222.333.444-55',
    specialty: 'Dermatologia',
    crm: 'CRM/SP 234567',
    address: 'Av. Brigadeiro Faria Lima, 200, Itaim Bibi, São Paulo, SP, 04538-000',
    createdAt: '2024-01-11T09:30:00Z',
    updatedAt: '2024-01-11T09:30:00Z'
  },
  {
    id: 3,
    name: 'Dr. Roberto Alves Pereira',
    cpf: '333.444.555-66',
    specialty: 'Ortopedia',
    crm: 'CRM/SP 345678',
    address: 'Rua Oscar Freire, 300, Cerqueira César, São Paulo, SP, 01426-000',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-12T11:00:00Z'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 1,
    date: '2024-02-15',
    time: '09:00',
    status: 'SCHEDULED',
    patientId: 1,
    doctorId: 1,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 2,
    date: '2024-02-16',
    time: '14:30',
    status: 'CONFIRMED',
    patientId: 2,
    doctorId: 2,
    createdAt: '2024-01-21T15:00:00Z',
    updatedAt: '2024-01-21T15:00:00Z'
  },
  {
    id: 3,
    date: '2024-02-17',
    time: '10:15',
    status: 'SCHEDULED',
    patientId: 3,
    doctorId: 3,
    createdAt: '2024-01-22T08:30:00Z',
    updatedAt: '2024-01-22T08:30:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@saude.com',
    name: 'Administrador',
    password: 'hashedpassword123',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    email: 'gerente@saude.com',
    name: 'Gerente Silva',
    password: 'hashedpassword456',
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z'
  },
  {
    id: 3,
    email: 'operador@saude.com',
    name: 'Operador Santos',
    password: 'hashedpassword789',
    createdAt: '2024-01-03T14:00:00Z',
    updatedAt: '2024-01-03T14:00:00Z'
  }
];
