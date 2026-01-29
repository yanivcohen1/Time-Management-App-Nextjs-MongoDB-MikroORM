import { getORM, handleError } from '@/lib/db';
import { User } from '@/entities/User';
import { isAuthenticatedApp } from '@/lib/auth';

export type usersGetResponse = {
  id: string;
  name: string;
  email: string;
  role: User['role'];
  createdAt: Date;
  updatedAt: Date;
}[];

async function handlerGET() {
  const userPayload = await isAuthenticatedApp();
  if (!userPayload) return Response.json({ message: 'Unauthorized' }, { status: 401 });

  // Only admins can list all users
  if (userPayload.role !== 'admin') {
    return Response.json({ message: 'Forbidden' }, { status: 403 });
  }

  const orm = await getORM();
  const em = orm.em.fork();

  try {
    const users = await em.find(User, {}, { fields: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'] });
    return Response.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ message: 'Error fetching users' }, { status: 500 });
  }
}

export const GET = handleError(handlerGET);