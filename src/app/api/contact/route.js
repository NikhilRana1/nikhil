import nodemailer from "nodemailer";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

// RFC-5322 is famously hard to match exactly; this only needs to reject
// obvious typos and junk before a real address reaches SMTP.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Built lazily rather than at module load: importing this route must never
// throw just because env vars aren't set yet, so a misconfigured deploy
// fails on the first form submission (as a clean error) rather than on boot.
function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_USERNAME || !SMTP_PASSWORD) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USERNAME, pass: SMTP_PASSWORD },
  });
}

function badRequest(message) {
  return Response.json({ error: message }, { status: 400 });
}

function validate(body) {
  if (!body) return "Invalid request body";

  const { name, email, message } = body;

  if (typeof name !== "string" || !name.trim()) return "Please enter your name";
  if (name.length > MAX_NAME_LENGTH) return "Name is too long";

  if (typeof email !== "string" || !email.trim()) return "Please enter your email";
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email.trim())) {
    return "Please enter a valid email address";
  }

  if (typeof message !== "string" || !message.trim()) return "Please enter a message";
  if (message.length > MAX_MESSAGE_LENGTH) return "Message is too long";

  return null;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const validationError = validate(body);
  if (validationError) return badRequest(validationError);

  const name = body.name.trim();
  const email = body.email.trim();
  const message = body.message.trim();

  const transporter = getTransporter();
  const toAddress = process.env.CONTACT_TO_EMAIL;

  if (!transporter || !toAddress) {
    return Response.json(
      { error: "The contact form is temporarily unavailable. Please email directly instead." },
      { status: 503 }
    );
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.SMTP_FROM || process.env.SMTP_USERNAME}>`,
      to: toAddress,
      replyTo: `"${name}" <${email}>`,
      subject: `New portfolio message from ${name}`,
      text: `${message}\n\n—\n${name} <${email}>`,
    });
  } catch {
    return Response.json(
      { error: "Couldn't send your message right now. Please try again in a moment." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
