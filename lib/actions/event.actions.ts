'use server';

import { Event } from '@/database';
import connectDB from '../mongodb';

export const getEventBySlug = async (slug: string) => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug }).lean();
    return event;
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    return null;
  }
}

const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug }).lean();
    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    });
    return similarEvents;
  } catch (error) {
    console.error('Error fetching similar events:', error);
    return [];
  }
};

export default getSimilarEventsBySlug;

export const getAllEvents = async () => {
  try {
    await connectDB();
    const events = await Event.find({}).lean();
    console.log('All events fetched:', events);
    console.log(process.env.MONGODB_URI);
    return events;
  } catch (error) {
    console.error('Error fetching all events:', error);
    return [];
  }
};
