import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      firstName,
      surname,
      email,
      contactNumber,
      journey,
      travellers,
      message,
    } = body;

    // 验证必填字段
    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    // 发送邮件
    const data = await resend.emails.send({
      from: "Travnox Website <onboarding@resend.dev>", // 之后改成你的域名
      to: [
        "eddie@travnox.com.au",
        "karl@travnox.com.au",
        "hello@travnox.com.au",
      ], // 替换为你的接收邮箱
      subject: `New Contact Form Submission from ${firstName} ${surname}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${surname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact Number:</strong> ${
          contactNumber || "Not provided"
        }</p>
        <p><strong>Journey:</strong> ${journey || "Not selected"}</p>
        <p><strong>Number of Travellers:</strong> ${
          travellers || "Not specified"
        }</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json(
      { message: "Email sent successfully", id: data.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
