import { jwtVerify, SignJWT } from 'jose';


const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'nirali-sai-boutique-secret-key-for-dev'
);

export interface UserJwtPayload {
  jti: string;
  iat: number;
  exp: number;
  email: string;
  role: 'user' | 'admin';
}

export async function signToken(email: string, role: 'user' | 'admin'): Promise<string> {
  const token = await new SignJWT({ email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(Math.random().toString(36).substr(2, 9))
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
  
  return token;
}

export async function verifyToken(token: string): Promise<UserJwtPayload> {
  try {
    const verified = await jwtVerify(token, SECRET_KEY);
    return verified.payload as unknown as UserJwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function validateCredentials(email: string, password: string): { isValid: boolean; role: 'user' | 'admin' | null } {
  // Hardcoded credentials
  if (email === 'test@gmail.com' && password === '123') {
    return { isValid: true, role: 'user' };
  }
  
  if (email === 'admin@gmail.com' && password === '123') {
    return { isValid: true, role: 'admin' };
  }
  
  return { isValid: false, role: null };
}