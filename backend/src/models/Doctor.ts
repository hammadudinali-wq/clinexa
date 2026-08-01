import { Schema, model, Document, Types } from "mongoose";

export interface IDoctor extends Document {
  userId: Types.ObjectId;
  specialization?: string;
  qualification?: string;
  experience?: number;
  phone?: string;
  department?: string;
  available: boolean;

  totalPatients: number;
  totalAppointments: number;
  totalEarnings: number;
  rating: number;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    specialization: {
      type: String,
      default: "",
      trim: true,
    },

    qualification: {
      type: String,
      default: "",
      trim: true,
    },

    experience: {
      type: Number,
      default: 0,
    },

    phone: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
      trim: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    totalPatients: {
      type: Number,
      default: 0,
    },

    totalAppointments: {
      type: Number,
      default: 0,
    },

    totalEarnings: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IDoctor>("Doctor", DoctorSchema);