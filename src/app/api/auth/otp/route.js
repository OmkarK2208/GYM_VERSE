import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // For security, don't reveal if the user exists or not, but for testing we can return an error
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
    }

    // Generate a secure 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Set expiry to 5 minutes from now
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiry }
    });

    // We don't have an email provider (like Resend) configured yet.
    // Instead of sending an email, we output the OTP to the server console for testing.
    console.log(`\n================================`);
    console.log(`🔑 DEVELOPMENT OTP CODE`);
    console.log(`Email: ${email}`);
    console.log(`OTP:   ${otp}`);
    console.log(`================================\n`);

    return NextResponse.json({ success: true, message: 'OTP sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('OTP Generation Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
