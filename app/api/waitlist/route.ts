import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const WAITLIST_FILE = path.join(DATA_DIR, 'waitlist.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Initialize waitlist file if it doesn't exist
async function initWaitlistFile() {
  try {
    await fs.access(WAITLIST_FILE)
  } catch {
    await fs.writeFile(WAITLIST_FILE, JSON.stringify([], null, 2))
  }
}

// GET - Retrieve all waitlist entries
export async function GET() {
  try {
    await ensureDataDir()
    await initWaitlistFile()
    
    const fileContents = await fs.readFile(WAITLIST_FILE, 'utf8')
    const entries = JSON.parse(fileContents)
    
    return NextResponse.json({ entries }, { status: 200 })
  } catch (error) {
    console.error('Error reading waitlist:', error)
    return NextResponse.json(
      { error: 'Failed to read waitlist entries' },
      { status: 500 }
    )
  }
}

// POST - Add a new waitlist entry
export async function POST(request: NextRequest) {
  try {
    await ensureDataDir()
    await initWaitlistFile()

    const body = await request.json()
    const { email, school, destination } = body

    // Validate input
    if (!email || !school || !destination) {
      return NextResponse.json(
        { error: 'Email, school, and destination are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Read existing entries
    const fileContents = await fs.readFile(WAITLIST_FILE, 'utf8')
    const entries = JSON.parse(fileContents)

    // Check if email already exists
    const existingEntry = entries.find((entry: any) => entry.email.toLowerCase() === email.toLowerCase())
    if (existingEntry) {
      return NextResponse.json(
        { error: 'This email is already on the waitlist' },
        { status: 409 }
      )
    }

    // Add new entry
    const newEntry = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      school,
      destination,
      createdAt: new Date().toISOString(),
    }

    entries.push(newEntry)

    // Write back to file
    await fs.writeFile(WAITLIST_FILE, JSON.stringify(entries, null, 2))

    return NextResponse.json(
      { message: 'Successfully added to waitlist', entry: newEntry },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding to waitlist:', error)
    return NextResponse.json(
      { error: 'Failed to add to waitlist' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a specific entry or clear all entries
export async function DELETE(request: NextRequest) {
  try {
    await ensureDataDir()
    await initWaitlistFile()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const clearAll = searchParams.get('clearAll') === 'true'

    // Read existing entries
    const fileContents = await fs.readFile(WAITLIST_FILE, 'utf8')
    let entries = JSON.parse(fileContents)

    if (clearAll) {
      // Clear all entries
      entries = []
      await fs.writeFile(WAITLIST_FILE, JSON.stringify([], null, 2))
      return NextResponse.json(
        { message: 'All entries cleared successfully' },
        { status: 200 }
      )
    } else if (id) {
      // Delete specific entry
      const initialLength = entries.length
      entries = entries.filter((entry: any) => entry.id !== id)
      
      if (entries.length === initialLength) {
        return NextResponse.json(
          { error: 'Entry not found' },
          { status: 404 }
        )
      }

      await fs.writeFile(WAITLIST_FILE, JSON.stringify(entries, null, 2))
      return NextResponse.json(
        { message: 'Entry deleted successfully' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Either id or clearAll parameter is required' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error deleting from waitlist:', error)
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    )
  }
}