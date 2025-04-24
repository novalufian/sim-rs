// lib/jwt.ts
import jwt, { Secret, SignOptions } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey'

export function signJwt(payload: object, expiresIn = '1d') {
    return jwt.sign(payload, JWT_SECRET as Secret, { expiresIn } as SignOptions)
}

export function verifyJwt(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch {
        return null
    }
}
