import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'secret';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decrypt(input) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const c = await cookies();
  const session = c.get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function setSession(userId) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expires });

  const c = await cookies();
  c.set('session', session, { expires, httpOnly: true, path: '/' });
}

export async function destroySession() {
  const c = await cookies();
  c.delete('session');
}
