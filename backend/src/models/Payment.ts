import mongoose, { Schema, Document } from "mongoose";

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export interface IPayment extends Document {
  patientId: mongoose.Types.ObjectId;
  appointmentId: mongoose.Types.ObjectId;
  amount: number;
  method: string;
  transactionId: string;
  status: PaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    method: {
      type: String,
      enum: ["Cash", "Card", "JazzCash", "EasyPaisa", "Bank Transfer"],
      default: "Cash",
    },

    transactionId: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPayment>("Payment", PaymentSchema);