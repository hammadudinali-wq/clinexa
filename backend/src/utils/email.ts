import nodemailer from "nodemailer";

// ==========================
// Send Email Function
// ==========================
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"Clinexa Hospital" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}`);
    console.log(`📧 Message ID: ${info.messageId}`);
    
    return info;
  } catch (error) {
    console.error("❌ Email Error:", error);
    throw error;
  }
};

// ==========================
// Send Welcome Email
// ==========================
export const sendWelcomeEmail = async (to: string, name: string) => {
  const subject = "Welcome to Clinexa Hospital!";
  const html = `
    <h1>Welcome ${name}!</h1>
    <p>Thank you for registering with Clinexa Hospital.</p>
    <p>We are here to provide you with the best healthcare services.</p>
    <br>
    <p>Best regards,</p>
    <p><strong>Clinexa Hospital Team</strong></p>
  `;
  return sendEmail(to, subject, html);
};

// ==========================
// Send Appointment Confirmation Email
// ==========================
export const sendAppointmentEmail = async (
  to: string,
  patientName: string,
  doctorName: string,
  date: string,
  time: string
) => {
  const subject = "Appointment Confirmation";
  const html = `
    <h1>Appointment Confirmed</h1>
    <p><strong>Patient:</strong> ${patientName}</p>
    <p><strong>Doctor:</strong> ${doctorName}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Time:</strong> ${time}</p>
    <br>
    <p>Please arrive 15 minutes before your appointment.</p>
    <br>
    <p>Best regards,</p>
    <p><strong>Clinexa Hospital Team</strong></p>
  `;
  return sendEmail(to, subject, html);
};

// ==========================
// Send Password Reset Email
// ==========================
export const sendPasswordResetEmail = async (
  to: string,
  resetToken: string
) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const subject = "Password Reset Request";
  const html = `
    <h1>Password Reset</h1>
    <p>You requested to reset your password.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}" style="
      display: inline-block;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    ">Reset Password</a>
    <p>This link will expire in <strong>1 hour</strong>.</p>
    <br>
    <p>If you didn't request this, please ignore this email.</p>
    <br>
    <p>Best regards,</p>
    <p><strong>Clinexa Hospital Team</strong></p>
  `;
  return sendEmail(to, subject, html);
};

// ==========================
// Send Payment Confirmation Email
// ==========================
export const sendPaymentEmail = async (
  to: string,
  patientName: string,
  amount: number,
  paymentId: string
) => {
  const subject = "Payment Confirmation";
  const html = `
    <h1>Payment Confirmed</h1>
    <p><strong>Patient:</strong> ${patientName}</p>
    <p><strong>Amount:</strong> $${amount}</p>
    <p><strong>Payment ID:</strong> ${paymentId}</p>
    <br>
    <p>Thank you for your payment.</p>
    <br>
    <p>Best regards,</p>
    <p><strong>Clinexa Hospital Team</strong></p>
  `;
  return sendEmail(to, subject, html);
};

// ==========================
// Send Prescription Email
// ==========================
export const sendPrescriptionEmail = async (
  to: string,
  patientName: string,
  doctorName: string,
  medications: any[]
) => {
  const subject = "Your Prescription";
  
  let medicationsHtml = "";
  medications.forEach((med, index) => {
    medicationsHtml += `
      <tr>
        <td>${index + 1}</td>
        <td>${med.name}</td>
        <td>${med.dosage}</td>
        <td>${med.frequency}</td>
        <td>${med.duration}</td>
      </tr>
    `;
  });

  const html = `
    <h1>Your Prescription</h1>
    <p><strong>Patient:</strong> ${patientName}</p>
    <p><strong>Doctor:</strong> ${doctorName}</p>
    <br>
    <h3>Medications:</h3>
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>#</th>
          <th>Medicine</th>
          <th>Dosage</th>
          <th>Frequency</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        ${medicationsHtml}
      </tbody>
    </table>
    <br>
    <p>Take medications as prescribed.</p>
    <br>
    <p>Best regards,</p>
    <p><strong>Clinexa Hospital Team</strong></p>
  `;
  return sendEmail(to, subject, html);
};