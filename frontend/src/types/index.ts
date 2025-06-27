
export interface Patient {
  id: number;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: number;
  name: string;
  cpf: string;
  specialty: string;
  crm: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: number;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  patientId: number;
  patient?: Patient;
  doctorId: number;
  doctor?: Doctor;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}
