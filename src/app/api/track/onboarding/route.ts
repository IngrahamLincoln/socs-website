import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userProfiles } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, isTeacher, gradeLevel, school } = body;

    // Validate that we have at least a unique ID
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Save the data to the database using Drizzle ORM
    try {
      await db.insert(userProfiles).values({
        userId,
        isTeacher,
        gradeLevel,
        school,
        onboardingCompleted: true, // Mark that they have answered
      }).onConflictDoUpdate({
        target: userProfiles.userId,
        set: {
          isTeacher,
          gradeLevel,
          school,
          onboardingCompleted: true,
          updatedAt: new Date()
        },
      });

      console.log('User profile saved:', { userId, isTeacher, gradeLevel, school });
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}