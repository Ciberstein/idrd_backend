const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

function fullName(account) {
  return [account.first_name, account.middle_name, account.last_name1, account.last_name2]
    .filter(Boolean)
    .join(' ')
    .toUpperCase();
}

function formatAddress(address) {
  if (!address) return 'N/A';
  return [
    address.viaType?.code,
    address.via_number,
    address.via_bis ? 'BIS' : null,
    address.via_quadrant || null,
    '#',
    address.cross_number,
    address.cross_quadrant || null,
    '-',
    address.plate,
    address.complement || null,
  ].filter(Boolean).join(' ');
}

function buildHtml(account, reserva) {
  const { gimnasio, address } = reserva;
  const gymAddress = gimnasio.address || '';
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(gymAddress)}`;
  const horario = `${reserva.start_time} - ${reserva.end_time}`;

  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;background-color:#f8fafc;color:#74787e;height:100%;line-height:1.4;margin:0;width:100%!important;word-break:break-word">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;background-color:#f8fafc;margin:0;padding:0;width:100%">
    <tbody>
      <tr>
        <td align="center" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;margin:0;padding:0;width:100%">
            <tbody>
              <tr>
                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;padding:25px 0;text-align:center">
                  <a href="https://portalciudadano.idrd.gov.co" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#bbbfc3;font-size:19px;font-weight:bold;text-decoration:none" target="_blank">
                    <img src="https://ci3.googleusercontent.com/meips/ADKq_Nbh37JqgQORVt4OH8PuZsnlEX6NmtgIjBIfY7VUEQZeRF97P2RT4GImzuHFntsuQ7Q6GoUhfkhDlIDjPHD4MfQOPIaZgA0HYthvASFI_xpvCjetAiRl6ESXGhi6gevokhzkBPj6C82JYA9zYL98mHdkmRqpGLyG6Hfxq1Y35_8Ldo_Db4RzlQE=s0-d-e1-ft#http://cdn.mcauto-images-production.sendgrid.net/6989784ebfe9830d/5cdb8cb8-ef5a-4773-9390-00a458225f70/307x209.png" alt="Portal Ciudadano" height="120px" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;max-width:100%;border:none">
                    <br>
                    Portal Ciudadano
                  </a>
                </td>
              </tr>
              <tr>
                <td width="100%" cellpadding="0" cellspacing="0" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;background-color:#ffffff;border-bottom:1px solid #edeff2;border-top:1px solid #edeff2;margin:0;padding:0;width:100%">
                  <table align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;background-color:#ffffff;margin:0 auto;padding:0;width:570px">
                    <tbody>
                      <tr>
                        <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;padding:35px">
                          <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#3d4852;font-size:19px;font-weight:bold;margin-top:0;text-align:left">
                            ¡Reserva dotación ${gimnasio.idrd_id}!
                          </h1>
                          <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#3d4852;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">
                            Hemos registrado una reserva en línea de forma exitosa. A continuación se muestra la información principal:
                          </p>
                          <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#3d4852;font-size:19px;font-weight:bold;margin-top:0;text-align:left;margin-bottom:30px">
                            Datos de la reserva
                          </h1>
                          <p>
                            <span style="font-family:-apple-system,blinkmacsystemfont,'segoe ui',roboto,helvetica,arial,sans-serif,'apple color emoji','segoe ui emoji','segoe ui symbol';box-sizing:border-box;color:#3d4852;font-size:14px;font-weight:bold;margin-top:0;text-align:left;margin-bottom:30px"># Pago: </span>SELECCIÓN DE HORARIO
                          </p>
                          <p>
                            <span style="font-family:-apple-system,blinkmacsystemfont,'segoe ui',roboto,helvetica,arial,sans-serif,'apple color emoji','segoe ui emoji','segoe ui symbol';box-sizing:border-box;color:#3d4852;font-size:14px;font-weight:bold;margin-top:0;text-align:left;margin-bottom:30px">Horario: </span>${horario}
                          </p>
                          <p>
                            <span style="font-family:-apple-system,blinkmacsystemfont,'segoe ui',roboto,helvetica,arial,sans-serif,'apple color emoji','segoe ui emoji','segoe ui symbol';box-sizing:border-box;color:#3d4852;font-size:14px;font-weight:bold;margin-top:0;text-align:left;margin-bottom:30px">Fecha: </span>${reserva.reservation_date}
                          </p>
                          <p>
                            <span style="font-family:-apple-system,blinkmacsystemfont,'segoe ui',roboto,helvetica,arial,sans-serif,'apple color emoji','segoe ui emoji','segoe ui symbol';box-sizing:border-box;color:#3d4852;font-size:14px;font-weight:bold;margin-top:0;text-align:left;margin-bottom:30px">Total: </span>$ MENSUALIDAD
                          </p>
                          <p>
                            <span style="font-family:-apple-system,blinkmacsystemfont,'segoe ui',roboto,helvetica,arial,sans-serif,'apple color emoji','segoe ui emoji','segoe ui symbol';box-sizing:border-box;color:#3d4852;font-size:14px;font-weight:bold;margin-top:0;text-align:left;margin-bottom:30px">Dotación: </span>${gimnasio.idrd_id}
                          </p>
                          <p>
                            <span style="font-family:-apple-system,blinkmacsystemfont,'segoe ui',roboto,helvetica,arial,sans-serif,'apple color emoji','segoe ui emoji','segoe ui symbol';box-sizing:border-box;color:#3d4852;font-size:14px;font-weight:bold;margin-top:0;text-align:left;margin-bottom:30px">Parque: </span>${gimnasio.park}
                          </p>
                          <p>
                            <span style="font-family:-apple-system,blinkmacsystemfont,'segoe ui',roboto,helvetica,arial,sans-serif,'apple color emoji','segoe ui emoji','segoe ui symbol';box-sizing:border-box;color:#3d4852;font-size:14px;font-weight:bold;margin-top:0;text-align:left;margin-bottom:30px">Dirección: </span><a href="${mapsUrl}" target="_blank">${gymAddress}</a>
                          </p>
                          <br>
                          <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#3d4852;font-size:19px;font-weight:bold;margin-top:0;text-align:left;margin-bottom:30px">
                            Datos de la persona
                          </h1>
                          <p>
                            <span style="font-family:-apple-system,blinkmacsystemfont,'segoe ui',roboto,helvetica,arial,sans-serif,'apple color emoji','segoe ui emoji','segoe ui symbol';box-sizing:border-box;color:#3d4852;font-size:14px;font-weight:bold;margin-top:0;text-align:left;margin-bottom:30px">Nombre: </span>${fullName(account)}
                          </p>
                          <p>
                            <span style="font-family:-apple-system,blinkmacsystemfont,'segoe ui',roboto,helvetica,arial,sans-serif,'apple color emoji','segoe ui emoji','segoe ui symbol';box-sizing:border-box;color:#3d4852;font-size:14px;font-weight:bold;margin-top:0;text-align:left;margin-bottom:30px">Documento: </span>${account.doc_number}
                          </p>
                          <p>
                            <span style="font-family:-apple-system,blinkmacsystemfont,'segoe ui',roboto,helvetica,arial,sans-serif,'apple color emoji','segoe ui emoji','segoe ui symbol';box-sizing:border-box;color:#3d4852;font-size:14px;font-weight:bold;margin-top:0;text-align:left;margin-bottom:30px">Fecha de nacimiento: </span>${account.birth_date}T05:00:00.000000Z
                          </p>
                          <p>
                            <span style="font-family:-apple-system,blinkmacsystemfont,'segoe ui',roboto,helvetica,arial,sans-serif,'apple color emoji','segoe ui emoji','segoe ui symbol';box-sizing:border-box;color:#3d4852;font-size:14px;font-weight:bold;margin-top:0;text-align:left;margin-bottom:30px">Dirección: </span>${formatAddress(address)}
                          </p>
                          <p>
                            <span style="font-family:-apple-system,blinkmacsystemfont,'segoe ui',roboto,helvetica,arial,sans-serif,'apple color emoji','segoe ui emoji','segoe ui symbol';box-sizing:border-box;color:#3d4852;font-size:14px;font-weight:bold;margin-top:0;text-align:left;margin-bottom:30px">Teléfono: </span>${account.phone || 'N/A'}
                          </p>
                          <p>
                            <span style="font-family:-apple-system,blinkmacsystemfont,'segoe ui',roboto,helvetica,arial,sans-serif,'apple color emoji','segoe ui emoji','segoe ui symbol';box-sizing:border-box;color:#3d4852;font-size:14px;font-weight:bold;margin-top:0;text-align:left;margin-bottom:30px">Email: </span><a href="mailto:${account.email}" target="_blank">${account.email}</a>
                          </p>
                          <table align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;margin:30px auto;padding:0;text-align:center;width:100%">
                            <tbody>
                              <tr>
                                <td align="center" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                                    <tbody>
                                      <tr>
                                        <td align="center" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                                            <tbody>
                                              <tr>
                                                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                                                  <a style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;border-radius:3px;color:#fff;display:inline-block;text-decoration:none;background-color:#594d95;border-top:10px solid #594d95;border-right:18px solid #594d95;border-bottom:10px solid #594d95;border-left:18px solid #594d95">VALIDAR PAGO</a>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#3d4852;font-size:16px;line-height:1.5em;margin-top:0;text-align:left">
                            Portal Ciudadano - IDRD
                          </p>
                          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;border-top:1px solid #edeff2;margin-top:25px;padding-top:25px">
                            <tbody>
                              <tr>
                                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                                  <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#3d4852;line-height:1.5em;margin-top:0;text-align:left;font-size:12px">
                                    Si tiene problemas para hacer clic en el botón "VALIDAR PAGO", copia y pega la URL a continuación en su navegador web:
                                    <a style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;color:#594d95"></a>
                                    <br><br>
                                    IMPORTANTE: Este correo es informativo, favor no responder a esta dirección de correo, ya que no se encuentra habilitada para recibir mensajes
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box">
                  <table align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;margin:0 auto;padding:0;text-align:center;width:570px">
                    <tbody>
                      <tr>
                        <td align="center" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;padding:35px">
                          <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';box-sizing:border-box;line-height:1.5em;margin-top:0;color:#aeaeae;font-size:12px;text-align:center">
                            © 2024 Portal Ciudadano. Todos los derechos reservados.
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</div>`;
}

module.exports = async function sendReservaConfirmacion(account, reserva) {
  await resend.emails.send({
    from: `"Reserva IDRD" <${process.env.MAIL_SEND_ADDR}>`,
    to: account.email,
    subject: 'Reserva IDRD',
    html: buildHtml(account, reserva),
  });
};
