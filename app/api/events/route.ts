import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const formData = await request.formData();
    let event;
    try {
      event = Object.fromEntries(formData.entries());
    } catch (error) {
      return NextResponse.json(
        {
          message: 'Invalid JSON data',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 400 }
      );
    }

    const createdEvent = await Event.create(event);
    return NextResponse.json(
      { message: 'Event created successfully', event : createdEvent },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Event creation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}