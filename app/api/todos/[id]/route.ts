import { NextRequest } from 'next/server';
import { getORM } from '@/lib/db';
import { Todo } from '@/entities/Todo';
import { isAuthenticatedApp } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userPayload = isAuthenticatedApp(request);
    if (!userPayload) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const orm = await getORM();
    const em = orm.em.fork();

    const filter = userPayload.role === 'admin' ? { id } : { id, owner: userPayload.userId };
    const todo = await em.findOne(Todo, filter);

    if (!todo) {
      return Response.json({ message: 'Todo not found' }, { status: 404 });
    }

    const { title, description, status, dueTime, duration } = await request.json();

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (status !== undefined) todo.status = status;
    if (dueTime !== undefined) {
      if (dueTime) {
        const dueDate = new Date(dueTime);
        if (isNaN(dueDate.getTime())) {
          return Response.json({ message: 'Invalid dueTime format' }, { status: 400 });
        }
        todo.dueTime = dueDate;
      } else {
        todo.dueTime = undefined;
      }
    }
    if (duration !== undefined) todo.duration = duration;

    await em.flush();
    return Response.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return Response.json({ message: 'Error updating todo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userPayload = isAuthenticatedApp(request);
    if (!userPayload) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const orm = await getORM();
    const em = orm.em.fork();

    const filter = userPayload.role === 'admin' ? { id } : { id, owner: userPayload.userId };
    const todo = await em.findOne(Todo, filter);

    if (!todo) {
      return Response.json({ message: 'Todo not found' }, { status: 404 });
    }

    await em.removeAndFlush(todo);
    return Response.json({ message: 'Todo deleted' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return Response.json({ message: 'Error deleting todo' }, { status: 500 });
  }
}