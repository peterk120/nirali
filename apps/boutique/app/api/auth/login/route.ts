import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { rateLimiters } from '@/lib/rateLimiter';

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
        }

        // Rate limiting - use IP or email as identifier (disabled in development)
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        if (!isDevelopment) {
            const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
            const rateLimitResult = rateLimiters.login(`${clientIP}-${email}`);
            
            if (!rateLimitResult.success) {
                return NextResponse.json(
                    { success: false, error: rateLimitResult.message, retryAfter: rateLimitResult.retryAfter },
                    { status: 429, headers: { 'Retry-After': String(rateLimitResult.retryAfter || 60) } }
                );
            }
        }

        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
        }

        const token = await signToken(user.email, user.role, (user._id as any).toString());

        return NextResponse.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
    }
}
