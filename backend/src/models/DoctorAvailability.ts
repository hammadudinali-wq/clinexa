import mongoose, { Schema, Document } from "mongoose";

export interface IDoctorAvailability extends Document {
  doctorId: mongoose.Types.ObjectId;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isAvailable: boolean;
}

const DoctorAvailabilitySchema = new Schema<IDoctorAvailability>(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    dayOfWeek: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    slotDuration: {
      type: Number,
      default: 30,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const DoctorAvailability = mongoose.model<IDoctorAvailability>(
  "DoctorAvailability",
  DoctorAvailabilitySchema
);
export default DoctorAvailability;