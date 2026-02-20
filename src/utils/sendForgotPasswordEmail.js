import nodemailer from "nodemailer";
import { forgotPasswordEmailTemplate } from "./forgotPasswordEmailTemplate.js";

const sendForgotPasswordEmail = async (toEmail, name, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"YourApp 🔑" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "🔑 Password Reset Code - YourApp",
    html: forgotPasswordEmailTemplate(name, otp),
  };

  await transporter.sendMail(mailOptions);
};

export default sendForgotPasswordEmail;