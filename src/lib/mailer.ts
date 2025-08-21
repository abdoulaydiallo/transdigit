// lib/mailer.ts
import nodemailer from "nodemailer";

async function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
}

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> {
  const transporter = await createTransporter();
  await transporter.sendMail({ from: process.env.GMAIL_USER, to, subject, text, html });
}
