import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { setSession } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email, password, otp } = await req.json();

    if (!email || (!password && !otp)) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (otp) {
      // OTP Verification Flow
      if (!user.otp || user.otp !== otp) {
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
      }
      if (!user.otpExpiry || new Date() > user.otpExpiry) {
        return NextResponse.json({ error: 'OTP has expired' }, { status: 401 });
      }
      
      // Clear OTP upon successful login
      await prisma.user.update({
        where: { id: user.id },
        data: { otp: null, otpExpiry: null }
      });
    } else {
      // Password Verification Flow
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
    }

    await setSession(user.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
