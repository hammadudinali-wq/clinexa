import Joi from "joi";

export const registerValidation = Joi.object({
  fullName: Joi.string().required().min(3).max(50),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
  phone: Joi.string().required().pattern(/^[0-9]{11}$/),
  role: Joi.string().valid("admin", "doctor", "patient"),
});

export const loginValidation = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const changePasswordValidation = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required().min(6),
});

export const doctorValidation = Joi.object({
  userId: Joi.string().required(),
  name: Joi.string().required(),
  specialty: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required().email(),
});

export const patientValidation = Joi.object({
  userId: Joi.string().required(),
  age: Joi.number().required().min(0),
  gender: Joi.string().required().valid("Male", "Female", "Other"),
  phone: Joi.string().required().pattern(/^[0-9]{11}$/),
});

export const appointmentValidation = Joi.object({
  patientId: Joi.string().required(),
  doctorId: Joi.string().required(),
  appointmentDate: Joi.string().required(),
  appointmentTime: Joi.string().required(),
  reason: Joi.string().required(),
  status: Joi.string().valid("pending", "confirmed", "completed", "cancelled", "rescheduled"),
});