import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function getToken(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  const cookieStore = await cookies()
  return cookieStore.get('sb-access-token')?.value ?? null
}
