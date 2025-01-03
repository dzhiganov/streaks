import { defineEventHandler, readBody } from "h3";
import { User } from "~~/server/models/user.model";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const session = await getServerSession(event);

    await User.findByIdAndUpdate(session.user.userId, {
      $push: {
        activity_types: {
          ...body,
          created_by: session.user.userId,
        },
      },
    });

    return {
      success: true,
    };
  } catch (err) {
    console.error("Error: ", err);
  }
});
