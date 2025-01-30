import { getServerSession } from '#auth';
import { defineEventHandler, getQuery } from 'h3';
import mongoose from 'mongoose';
import { Log, User } from '~~/server/models/user.model';

export default defineEventHandler(async (event) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { activityId } = getQuery(event);
    const sessionData = await getServerSession(event);

    if (!activityId) {
      throw new Error('"activityId" is required');
    }

    // Find the log entry and ensure it belongs to the user
    const logEntry = await Log.findOne({
      _id: activityId,
      created_by: sessionData.user.userId,
    }).session(session);

    if (!logEntry) {
      throw new Error('Log entry not found or permission denied');
    }

    // Remove log from User history
    await User.findByIdAndUpdate(
      sessionData.user.userId,
      { $pull: { history: activityId } },
      { session },
    );

    // Delete the log itself
    await Log.deleteOne({ _id: activityId }).session(session);

    // Commit transaction
    await session.commitTransaction();

    return {
      success: true,
      message: 'Log entry deleted successfully',
    };
  } catch (error) {
    await session.abortTransaction();
    console.error('Transaction failed:', error.message);
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  } finally {
    session.endSession();
  }
});
