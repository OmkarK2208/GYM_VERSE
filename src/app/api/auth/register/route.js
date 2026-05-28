import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { setSession } from '@/lib/auth';

export async function POST(req) {
  try {
    const { name, email, password, age, gender, height, weight, goal } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        age: age ? parseInt(age) : null,
        gender,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        goal
      }
    });

    if (weight) {
      await prisma.weightLog.create({
        data: {
          userId: user.id,
          weight: parseFloat(weight)
        }
      });
    }

    await setSession(user.id);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
