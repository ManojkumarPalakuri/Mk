import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      return NextResponse.json({ success: false, error: "Email configuration missing on server." }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user,
        pass: pass,
      },
    });

    const mailOptions = {
      from: `"${name}" <${user}>`, // Spoofing 'from' is rejected by gmail, so we use the authenticated user and rely on replyTo
      replyTo: email,
      to: user, // Send to yourself
      subject: `[Portfolio Contact] ${subject}`,
      text: `You received a new message from your portfolio website:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #f8f9fa; padding: 20px; border-bottom: 1px solid #eaeaea; text-align: center;">
            <h2 style="margin: 0; color: #333;">New Contact Submission</h2>
          </div>
          <div style="padding: 25px; color: #444; line-height: 1.6;">
            <p style="margin: 0 0 10px;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 10px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #0066cc;">${email}</a></p>
            <p style="margin: 0 0 10px;"><strong>Subject:</strong> ${subject}</p>
            <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;"/>
            <p style="margin: 0 0 10px; font-weight: bold;">Message:</p>
            <div style="background: #fdfdfd; padding: 15px; border-radius: 6px; border: 1px solid #eaeaea;">
               <p style="margin: 0; white-space: pre-wrap; font-size: 15px;">${message}</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
