import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Knowledge Hub" <${process.env.EMAIL_USER}>`, // ✅ friendlier + safer
      to,
      subject,
      text,
    });

    console.log("✅ Email sent:", info.messageId);
    console.log("📩 Preview URL (if test):", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("❌ Email error:", err);
  }
};

export default sendEmail;

