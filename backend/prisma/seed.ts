import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  const adminEmail = 'admin@hospital.com';
  const adminPassword = 'admin123';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('👤 Usuário administrador já existe');
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: adminEmail,
        password: hashedPassword,
      },
    });

    console.log('👤 Usuário administrador criado:', {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    });
  }

  console.log('🏥 Criando dados de exemplo...');

  const doctorsData = [
    {
      name: 'Dr. Carlos Pereira',
      cpf: '111.222.333-44',
      specialty: 'Cardiologia',
      crm: 'CRM/SP 123456',
      address: 'Av. Paulista, 1000 - São Paulo/SP',
    },
    {
      name: 'Dra. Ana Santos',
      cpf: '222.333.444-55',
      specialty: 'Pediatria',
      crm: 'CRM/SP 654321',
      address: 'Rua Augusta, 500 - São Paulo/SP',
    },
    {
      name: 'Dr. Roberto Silva',
      cpf: '333.444.555-66',
      specialty: 'Ortopedia',
      crm: 'CRM/SP 789012',
      address: 'Av. Faria Lima, 2000 - São Paulo/SP',
    },
  ];

  for (const doctorData of doctorsData) {
    const existingDoctor = await prisma.doctor.findUnique({
      where: { crm: doctorData.crm },
    });

    if (!existingDoctor) {
      const doctor = await prisma.doctor.create({
        data: doctorData,
      });
      console.log(`👨‍⚕️ Médico criado: ${doctor.name} - ${doctor.specialty}`);
    }
  }

  const patientsData = [
    {
      name: 'Maria Silva',
      cpf: '123.456.789-00',
      birthDate: new Date('1985-03-15'),
      phone: '(11) 99999-1111',
      email: 'maria.silva@email.com',
      address: 'Rua das Flores, 123 - São Paulo/SP',
    },
    {
      name: 'João Santos',
      cpf: '987.654.321-00',
      birthDate: new Date('1990-07-22'),
      phone: '(11) 99999-2222',
      email: 'joao.santos@email.com',
      address: 'Av. Brasil, 456 - São Paulo/SP',
    },
    {
      name: 'Ana Costa',
      cpf: '456.789.123-00',
      birthDate: new Date('1978-11-08'),
      phone: '(11) 99999-3333',
      email: 'ana.costa@email.com',
      address: 'Rua da Consolação, 789 - São Paulo/SP',
    },
  ];

  for (const patientData of patientsData) {
    const existingPatient = await prisma.patient.findUnique({
      where: { email: patientData.email },
    });

    if (!existingPatient) {
      const patient = await prisma.patient.create({
        data: patientData,
      });
      console.log(`👥 Paciente criado: ${patient.name}`);
    }
  }

  console.log('✅ Seed concluído com sucesso!');
  console.log('');
  console.log('📋 Credenciais do Administrador:');
  console.log('   Email: admin@hospital.com');
  console.log('   Senha: admin123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
