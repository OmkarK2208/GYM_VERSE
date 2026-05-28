import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Today's Workouts
  const todaysWorkouts = await prisma.workout.findMany({
    where: {
      userId,
      date: { gte: today }
    },
    include: { exercises: true }
  });

  let todayVolume = 0;
  let prOfTheDay = null;

  todaysWorkouts.forEach(workout => {
    workout.exercises.forEach(ex => {
      todayVolume += (ex.weight * ex.reps * ex.sets);
      if (ex.isPr) {
        prOfTheDay = ex;
      }
    });
  });

  // Calculate BMI
  let bmi = null;
  let bmiCategory = "";
  if (user.height && user.weight) {
    const heightInMeters = user.height / 100;
    bmi = user.weight / (heightInMeters * heightInMeters);
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi < 24.9) bmiCategory = "Normal weight";
    else if (bmi < 29.9) bmiCategory = "Overweight";
    else bmiCategory = "Obesity";
  }

  // Water Intake
  const waterLog = await prisma.waterLog.findFirst({
    where: { userId, date: { gte: today } }
  });

  // Calculate Streak (Simplified for now - just total unique workout days)
  const allWorkouts = await prisma.workout.findMany({
    where: { userId },
    select: { date: true },
    orderBy: { date: 'desc' }
  });

  let streak = 0;
  let checkDate = new Date(today);
  
  // Create a Set of date strings (YYYY-MM-DD)
  const workoutDates = new Set(allWorkouts.map(w => w.date.toISOString().split('T')[0]));
  
  if (workoutDates.has(today.toISOString().split('T')[0])) {
    streak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // If no workout today, check if they worked out yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    if (workoutDates.has(checkDate.toISOString().split('T')[0])) {
      streak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  while (workoutDates.has(checkDate.toISOString().split('T')[0]) && streak > 0) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return NextResponse.json({
    user,
    todayVolume,
    prOfTheDay,
    bmi: bmi ? bmi.toFixed(1) : null,
    bmiCategory,
    waterGlasses: waterLog ? waterLog.glasses : 0,
    streak,
    workoutsCount: todaysWorkouts.length
  });
}
