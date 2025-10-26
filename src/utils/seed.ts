import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const carrera1 = await prisma.carrera.create({
    data: {
      codigo: '8266',
      nombre: 'ITI',
      catalogo: '202410',
      estudiantes: {
        create: [{ rut: '222222222' }],
      },
    },
  });

  const carrera2 = await prisma.carrera.create({
    data: {
      codigo: '8616',
      nombre: 'ICCI',
      catalogo: '202310',
    },
  });

  const carrera3 = await prisma.carrera.create({
    data: {
      codigo: '8606',
      nombre: 'ICI',
      catalogo: '202320',
      estudiantes: {
        create: [{ rut: '222222222' }, { rut: '333333333' }],
      },
    },
  });

  console.log('Datos insertados correctamente');
}

main()
  .catch((e) => {
    console.error('Error', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

