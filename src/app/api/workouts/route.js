import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const workouts = await prisma.workout.findMany({
    where: { userId: session.userId },
    include: { exercises: true },
    orderBy: { date: 'desc' }
  });

  return NextResponse.json(workouts);
}

export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { category, duration, exercises } = await req.json();

  if (!category || !exercises || exercises.length === 0) {
    return NextResponse.json({ error: 'Invalid workout data' }, { status: 400 });
  }

  // Find user's previous maxes to calculate PR
  const previousExercises = await prisma.exerciseLog.findMany({
    where: { workout: { userId: session.userId } }
  });

  const maxWeightPerExercise = {};
  previousExercises.forEach(ex => {
    if (!maxWeightPerExercise[ex.name] || ex.weight > maxWeightPerExercise[ex.name]) {
      maxWeightPerExercise[ex.name] = ex.weight;
    }
  });

  const processedExercises = exercises.map(ex => {
    const isPr = !maxWeightPerExercise[ex.name] || ex.weight > maxWeightPerExercise[ex.name];
    return {
      name: ex.name,
      weight: parseFloat(ex.weight),
      sets: parseInt(ex.sets),
      reps: parseInt(ex.reps),
      isPr
    };
  });

  const workout = await prisma.workout.create({
    data: {
      userId: session.userId,
      category,
      duration: duration ? parseInt(duration) : null,
      exercises: {
        create: processedExercises
      }
    },
    include: { exercises: true }
  });

  return NextResponse.json(workout, { status: 201 });
}
