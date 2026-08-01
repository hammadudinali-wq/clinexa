import { Schema, model, Types, Document } from "mongoose";

export interface IMedicalRecord extends Document {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  appointmentId: Types.ObjectId;

  diagnosis: string;

  symptoms: string[];

  treatment: string;

  prescriptionId?: Types.ObjectId;

  labReports: string[];

  notes?: string;
}

const medicalRecordSchema = new Schema<IMedicalRecord>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },

    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },

    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],

    treatment: {
      type: String,
      required: true,
      trim: true,
    },

    prescriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Prescription",
    },

    labReports: [
      {
        type: String,
      },
    ],

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const MedicalRecord = model<IMedicalRecord>(
  "MedicalRecord",
  medicalRecordSchema
);

export default MedicalRecord;