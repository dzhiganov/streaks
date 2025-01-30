import { defineEventHandler, readBody } from 'h3';
import mongoose from 'mongoose';
import { Log } from '~~/server/models/user.model';

export default defineEventHandler(async (event) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const body = await readBody(event);

    if (body.id) {
      const updatedLogEntry = await Log.findByIdAndUpdate(
        body.id,
        {
          activity: body.activity,
          updated_at: new Date(),
          time_min: body.time_min || 0,
        },
        { session },
      );

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
    throw createError({ statusCode: 500, statusMessage: err.message });
  } finally {
    session.endSession();
  }
});
