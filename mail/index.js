const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const mail = async (to, subject, body, sender = "") => {

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background-color:#4f46e5;padding:28px 32px;text-align:center;">
            <p style="margin:0;color:#c7d2fe;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Portal Ciudadano</p>
            <h1 style="margin:4px 0 0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">${sender}</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:36px 32px;color:#1e293b;font-size:15px;line-height:1.7;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">
              Este correo fue generado automáticamente — por favor no respondas a este mensaje.
            </p>
            <p style="margin:8px 0 0;color:#cbd5e1;font-size:11px;">${sender} · Bogotá, Colombia</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  resend.emails.send({
    from: `${sender} <${process.env.MAIL_SEND_ADDR}>`,
    to,
    subject,
    html,
  });

  return true;
};

module.exports = mail;
