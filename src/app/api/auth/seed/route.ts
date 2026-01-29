import { NextRequest } from 'next/server';
import { getORM } from '@/lib/db';
import { seedDatabase } from '@/lib/seeder';

export interface seedPostResponse {
  message: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: NextRequest) {
  try {
    const orm = await getORM();
    const em = orm.em.fork();

    await seedDatabase(em);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seeding error:', error);
    return Response.json({ message: 'Seeding failed' }, { status: 500 });
  }
}