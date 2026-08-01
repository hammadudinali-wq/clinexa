import { Schema, model, Types, Document } from "mongoose";

export interface IMedicine {
  medicineName: string;
  dosage: string;
  duration: string;
  instructions: string;
}

export interface IPrescription extends Document {
  appointmentId: Types.ObjectId;
  doctorId: Types.ObjectId;
  patientId: Types.ObjectId;
  medicines: IMedicine[];
  notes?: string;
}

const prescriptionSchema = new Schema<IPrescription>(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    medicines: [
      {
        medicineName: {
          type: String,
          required: true,
          trim: true,
        },

        dosage: {
          type: String,
          required: true,
          trim: true,
        },

        duration: {
          type: String,
          required: true,
          trim: true,
        },

        instructions: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Prescription = model<IPrescription>(
  "Prescription",
  prescriptionSchema
);

export default Prescription;