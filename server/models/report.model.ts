import { Schema, model } from 'mongoose';

export const ReportSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  data: { type: Object, required: true },
  created_at: Date,
  type: { type: String, enum: ['weekly', 'monthly', 'yearly'], required: true },
  period_start: Date,
  period_end: Date,
});

export const Report = model('report', ReportSchema);
