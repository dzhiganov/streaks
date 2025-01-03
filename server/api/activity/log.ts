import { defineEventHandler, readBody } from "h3";
import { User, Log } from "~~/server/models/user.model";
import { getServerSession } from "#auth";
import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const body = await readBody(event);
    const sessionData = await getServerSession(event);
    const logEntry = await Log.create(
      [
        {
          activity: body.activity,
          created_at: new Date(),
          date: body.date ? new Date(body.date) : new Date(),
          from: body.from ? new Date(body.from) : null,
          to: body.to ? new Date(body.to) : null,
          time_min: body.time_min || 0,
          created_by: sessionData.user.userId,
        },
      ],
      { session }
    );

    // Update User
    await User.findByIdAndUpdate(
      sessionData.user.userId,
      {
        $push: { history: logEntry[0]._id },
      },
      { session }
    );

    await session.commitTransaction();

    return {
      success: true,
      logEntryId: logEntry[0]._id,
    };
  } catch (err) {
    await session.abortTransaction();
    console.error('Transaction failed:', err.message);
    throw createError({ statusCode: 500, statusMessage: err.message });
  } finally {
    session.endSession();
  }
});
