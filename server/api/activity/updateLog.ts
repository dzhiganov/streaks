import { getServerSession } from '#auth';
import { defineEventHandler, readBody } from 'h3';
import mongoose from 'mongoose';
import { Log } from '~~/server/models/user.model';

export default defineEventHandler(async (event) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const body = await readBody(event);
    const sessionData = await getServerSession(event);

    console.log('body', body);

    // Check if an ID is provided in the query
    if (body.id) {
      // Update the existing log entry based on the passed ID
      const updatedLogEntry = await Log.findByIdAndUpdate(
        body.id,
        {
          activity: body.activity,
          updated_at: new Date(),
          time_min: body.time_min || 0,
        },
        { session }, // Return the updated document
      );

      console.log('updatedLogEntry', updatedLogEntry);

      if (!updatedLogEntry) {
        throw new Error('Log entry not found');
      }

      await session.commitTransaction();

      return {
        success: true,
        logEntryId: updatedLogEntry._id,
      };
    }
  } catch (err) {
    await session.abortTransaction();
    console.error('Transaction failed:', err.message);
    throw createError({ statusCode: 500, statusMessage: err.message });
  } finally {
    session.endSession();
  }
});
