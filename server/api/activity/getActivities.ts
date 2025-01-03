import { defineEventHandler, readBody } from "h3";
import { Activity } from "~~/server/models/user.model";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);

    const res = await Activity.find({ created_by: session.user.userId })

    return {
        activities: res
    }
  } catch (err) {
    console.error("Error: ", err);
  }
});
