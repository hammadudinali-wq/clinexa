import { Schema, model, Document, Types } from "mongoose";

export interface IPatient extends Document {
  userId: Types.ObjectId;

  age?: number;
  gender?: "Male" | "Female" | "Other";
  bloodGroup?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;

  assignedDoctor?: Types.ObjectId;

  totalAppointments: number;
}

const PatientSchema = new Schema<IPatient>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    age: {
      type: Number,
      default: 0,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },

    bloodGroup: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    emergencyContact: {
      type: String,
      default: "",
    },

    assignedDoctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },

    totalAppointments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IPatient>("Patient", PatientSchema);