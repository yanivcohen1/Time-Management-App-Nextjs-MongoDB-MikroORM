import { NextRequest } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    return Response.json({ name: 'John Doe' });
  } catch (error) {
    console.error('Error fetching hello:', error);
    return Response.json({ message: 'Error fetching hello' }, { status: 500 });
  }
}