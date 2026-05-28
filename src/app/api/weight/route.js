import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const logs = await prisma.weightLog.findMany({
    where: { userId: session.userId },
    orderBy: { date: 'asc' }
  });

  return NextResponse.json(logs);
}

export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { weight } = await req.json();

  if (!weight) {
    return NextResponse.json({ error: 'Weight is required' }, { status: 400 });
  }

  const log = await prisma.weightLog.create({
    data: {
      userId: session.userId,
      weight: parseFloat(weight)
    }
  });

  // Update user's current weight
  await prisma.user.update({
    where: { id: session.userId },
    data: { weight: parseFloat(weight) }
  });

  return NextResponse.json(log, { status: 201 });
}
