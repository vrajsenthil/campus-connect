import { NextResponse } from 'next/server'
import { createClient } from 'redis'

const BOOKINGS_KEY = 'bookings:entries'
const TICKET_LIMIT = 35

let redisClient: ReturnType<typeof createClient> | null = null

async function getRedisClient() {
  if (!redisClient) {
    const url = process.env.REDIS_URL
    if (!url) throw new Error('REDIS_URL is not set')
    redisClient = createClient({ url })
    redisClient.on('error', (err) => console.error('Redis Error:', err))
    await redisClient.connect()
  }
  return redisClient
}

export async function GET() {
  try {
    const client = await getRedisClient()
    const data = await client.get(BOOKINGS_KEY)
    const bookings = data ? JSON.parse(data) : []
    const count = Array.isArray(bookings) ? bookings.length : 0
    const soldOut = count >= TICKET_LIMIT
    return NextResponse.json(
      { count, soldOut, limit: TICKET_LIMIT },
      { status: 200 }
    )
  } catch (error) {
    console.error('Capacity check error:', error)
    return NextResponse.json(
      { count: 0, soldOut: false, limit: TICKET_LIMIT },
      { status: 200 }
    )
  }
}
