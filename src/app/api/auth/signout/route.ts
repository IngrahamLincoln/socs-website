import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function GET() {
  // Clerk handles sign-out through its middleware
  // Just redirect to home or sign-in page
  redirect('/')
}