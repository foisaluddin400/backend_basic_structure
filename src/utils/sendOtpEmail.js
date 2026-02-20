import nodemailer from "nodemailer";
import { otpEmailTemplate } from "./emailTemplate.js";

const sendOtpEmail = async (toEmail, name, otp) => {
  try {
    console.log(toEmail, name, otp)
  const transporter = nodemailer.createTransport({
    service: "gmail",           
    auth: {
      user: process.env.EMAIL_USER,   
      pass: process.env.EMAIL_PASS,  
    },
  });

  const mailOptions = {
    from: `"YourApp 🔐" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "✅ Verify Your Email - OTP Code",
    html: otpEmailTemplate(name, otp),
  };


  await transporter.sendMail(mailOptions);
    console.log(mailOptions)
  } catch (error) {
    console.log(error)
  }
  
};

export default sendOtpEmail;