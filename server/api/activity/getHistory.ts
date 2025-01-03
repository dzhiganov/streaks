import { defineEventHandler, readBody } from "h3";
import { User } from "~~/server/models/user.model";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);
    const res = await User.findById(session.user.userId).select('history');

    return res
  } catch (err) {
    console.error("Error: ", err);
  }
});
