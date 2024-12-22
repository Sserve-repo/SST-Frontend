import 'server-only'
import { cookies } from 'next/headers'

export async function createSession(data: string) {
    console.log(data)
    const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
    const session = JSON.stringify({ data, expiresAt })
    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    }
    )
}

export async function updateSession() {
    const session = cookies().get('session')?.value

    if (!session) {
        return null
    }

    const expires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)

    const cookieStore = cookies()
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    })
}

export async function deleteSession() {
    const cookieStore = cookies()
    cookieStore.delete('session')
}