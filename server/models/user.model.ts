import { Schema, model } from 'mongoose';

export const ActivityTypeSchema = new Schema({
  title: String,
  description: { type: String, required: false, default: '' },
  is_default: { type: Boolean, required: false, default: false },
  created_by: { type: 'ObjectId', ref: 'User', required: false, default: null },
  created_at: Date,
});

export const ActivityType = model('activity_type', ActivityTypeSchema);

export const ActivitySchema = new Schema({
  title: String,
  description: { type: String, required: false, default: '' },
  type: { type: 'ObjectId', ref: 'ActivityType' },
  icon: { type: String, required: false, default: '' },
  color: String,
  active: Boolean,
  week_time_goal_min: { type: Number, required: false, default: 0 },
  day_time_goal_min: { type: Number, required: false, default: 0 },
  month_time_goal_min: { type: Number, required: false, default: 0 },
  created_at: Date,
  created_by: { type: 'ObjectId', ref: 'User' },
});

export const Activity = model('activity', ActivitySchema);

const LogSchema = new Schema({
  activity: { type: 'ObjectId', ref: 'Activity' },
  created_at: Date,
  date: Date,
  from: { type: Date, required: false, default: null },
  to: { type: Date, required: false, default: null },
  time_min: Number,
  created_by: { type: 'ObjectId', ref: 'User' },
});

export const Log = model('log', LogSchema);

export const UserSchema = new Schema({
  email: String,
  google_id: String,
  name: String,
  created_at: Date,
  photo_url: String,
  activities: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    default: [],
  },
  history: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Log' }],
    default: [],
  },
  activity_types: {
    type: [{ type: Schema.Types.ObjectId, ref: 'ActivityType' }],
    default: [],
  },
  subscription: {
    plan: { type: String, enum: ['basic', 'pro'], default: 'basic' },
    lifetime: { type: Boolean, default: false },
    purchasedAt: { type: Date, default: null },
    transaction_id: { type: String, default: null },
    expiresAt: { type: Date, default: null }, // null for lifetime
  },
});

export const User = model('user', UserSchema);
