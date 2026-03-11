import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export const sendFeedback = async (req, res) => {
  const { email, feedback, name } = req.body;
  if (!email || !feedback || !name) {
    return res
      .status(400)
      .json({ message: "Email , feedback and Name are required." });
  }

  try {
    const mailOptions = {
      to: process.env.EMAIL_RECEIVER,
      replayTo: email,
      subject: "New Feedback Received",
      text: `Feedback from: ${name}\n\n${feedback}\n\nReply to: ${email}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Email sending failed", error });
      }
      res.status(200).json({ message: "Feedback sent successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Error processing feedback", error });
  }
};
