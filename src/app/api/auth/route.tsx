// app/api/login/route.ts
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Fake user data for demo. Replace with DB logic.
const fakeUser = {
    id: 1,
    email: 'admin@example.com',
    password: await bcrypt.hash('password123', 10) // store hashed password
}

    export async function POST(request: Request) {
    const { email, password } = await request.json()


    const passwordMatch = await bcrypt.compare(password, fakeUser.password)

    if (!passwordMatch) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const token = jwt.sign({ id: fakeUser.id, email: fakeUser.email }, SECRET, { expiresIn: '1d' })

    const response = NextResponse.json({ message: 'Login success' })
    response.cookies.set('token', token, { httpOnly: true })

    return response
}
