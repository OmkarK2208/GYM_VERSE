import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const logs = await prisma.dietLog.findMany({
    where: { 
      userId: session.userId,
      date: { gte: today }
    },
    orderBy: { date: 'asc' }
  });

  return NextResponse.json(logs);
}

export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { meal, calories, protein } = await req.json();

  if (!meal || !calories) {
    return NextResponse.json({ error: 'Meal and calories are required' }, { status: 400 });
  }

  const log = await prisma.dietLog.create({
    data: {
      userId: session.userId,
      meal,
      calories: parseInt(calories),
      protein: parseInt(protein) || 0
    }
  });

  return NextResponse.json(log, { status: 201 });
}
