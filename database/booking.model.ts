import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Add index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

// Create compound index for common queries (event bookings by date)
BookingSchema.index({ eventId: 1, createdAt: -1 });

// Create index on email for user-specific booking lookups
BookingSchema.index({ email: 1 });

// Pre-save hook to validate that the referenced event exists
BookingSchema.pre('save', async function () {
  // Only validate eventId if it has been modified or is new
  if (this.isModified('eventId')) {
    try {
      const eventExists = await Event.findById(this.eventId);

      if (!eventExists) {
        throw new Error(
          `Event with ID ${this.eventId} does not exist. Please provide a valid event ID.`
        );
      }
    } catch (error) {
      throw new Error(
        `Error validating event: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
});

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
