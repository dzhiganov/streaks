import { Schema, model } from "mongoose";


const ActivityType = new Schema({
    title: String,
    description: String,
})

const Activity = new Schema({
    title: String,
    description: String,
    type: { type: 'ObjectId', ref: 'ActivityType' },
    icon: String,
    color: String,
    active: Boolean,
    week_time_goal_min: Number,
    day_time_goal_min: Number,
    month_time_goal_min: Number,
    createdAt: Date
})

const HistoryEntry = new Schema({
    activity: { type: 'ObjectId', ref: 'Activity' },
    createdAt: Date,
    from: Date,
    to: Date,
    time_min: Number,
})

const UserSchema = new Schema({
    email: String,
    googleId: String,
    name: String,
    createdAt: Date,
    photo_url: String,
    activities: [Activity],
    history:  [HistoryEntry],
    activityTypes: [ActivityType]
})


export const User = model("User", UserSchema);