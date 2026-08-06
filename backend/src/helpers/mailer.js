const nodemailer = require("nodemailer");
const env = require("../config/env");

let transporter = null;

function isMailConfigured() {
  return Boolean(env.smtp.host && env.smtp.from);
}

function getTransporter() {
  if (!isMailConfigured()) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: env.smtp.user
        ? {
            user: env.smtp.user,
            pass: env.smtp.pass
          }
        : undefined
    });
  }

  return transporter;
}

async function sendMail({ to, subject, text, html }) {
  const mailer = getTransporter();

  if (!mailer || !to) {
    return false;
  }

  await mailer.sendMail({
    from: env.smtp.from,
    to,
    subject,
    text,
    html
  });

  return true;
}

async function sendApplicationConfirmation({ to, fullName, applicationNumber }) {
  const subject = `Başvurunuz alındı — ${applicationNumber}`;
  const text = [
    `Merhaba ${fullName},`,
    "",
    "Başvurunuz başarıyla alınmıştır.",
    `Başvuru No: ${applicationNumber}`,
    "",
    "Telefon veya e-posta ile iletişime geçtiğimizde bu numarayı paylaşabilirsiniz.",
    "",
    "Tüketiciler Birliği"
  ].join("\n");

  return sendMail({
    to,
    subject,
    text,
    html: `<p>Merhaba ${fullName},</p><p>Başvurunuz başarıyla alınmıştır.</p><p><strong>Başvuru No:</strong> ${applicationNumber}</p><p>Telefon veya e-posta ile iletişime geçtiğimizde bu numarayı paylaşabilirsiniz.</p><p>Tüketiciler Birliği</p>`
  });
}

async function sendAdminNotification({ submission }) {
  const to = env.smtp.adminNotificationEmail;

  if (!to) return false;

  const subject = `Yeni başvuru — ${submission.applicationNumber}`;
  const text = [
    "Yeni bir tüketici başvurusu alındı.",
    "",
    `Başvuru No: ${submission.applicationNumber}`,
    `Ad Soyad: ${submission.fullName}`,
    `E-posta: ${submission.email}`,
    `Telefon: ${submission.phone || "-"}`,
    `Konu: ${submission.categoryLabel || submission.category}`,
    `Firma: ${submission.companyName || "-"}`,
    "",
    submission.message
  ].join("\n");

  return sendMail({
    to,
    subject,
    text,
    html: `<p>Yeni bir tüketici başvurusu alındı.</p><p><strong>Başvuru No:</strong> ${submission.applicationNumber}<br/><strong>Ad Soyad:</strong> ${submission.fullName}<br/><strong>E-posta:</strong> ${submission.email}<br/><strong>Telefon:</strong> ${submission.phone || "-"}<br/><strong>Konu:</strong> ${submission.categoryLabel || submission.category}<br/><strong>Firma:</strong> ${submission.companyName || "-"}</p><p>${String(submission.message || "").replace(/\n/g, "<br/>")}</p>`
  });
}

module.exports = {
  isMailConfigured,
  sendAdminNotification,
  sendApplicationConfirmation,
  sendMail
};
