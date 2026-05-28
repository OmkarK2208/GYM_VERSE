import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const waterLog = await prisma.waterLog.findFirst({
    where: { userId: session.userId, date: { gte: today } }
  });

  if (waterLog) {
    await prisma.waterLog.update({
      where: { id: waterLog.id },
      data: { glasses: waterLog.glasses + 1 }
    });
  } else {
    await prisma.waterLog.create({
      data: { userId: session.userId, glasses: 1 }
    });
  }

  return NextResponse.json({ success: true });
}
