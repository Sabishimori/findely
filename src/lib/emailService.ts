import nodemailer from "nodemailer";

interface SendOtpParams {
  to: string;
  name?: string;
  otpCode: string;
}

export async function sendOtpEmail({ to, name, otpCode }: SendOtpParams): Promise<{ success: boolean; error?: string }> {
  try {
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || process.env.EMAIL_SERVER_USER || "";
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_SERVER_PASSWORD || "";
    const smtpHost = process.env.SMTP_HOST || (smtpUser.includes("@gmail.com") ? "smtp.gmail.com" : "smtp.resend.com");
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpFrom = process.env.SMTP_FROM || process.env.EMAIL_FROM || `"Findely Security" <${smtpUser || "auth@findely.app"}>`;

    const recipientName = name?.trim() || to.split("@")[0];

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Findely Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F7F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1D2E1B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F7F5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="540" style="max-width: 540px; background-color: #FFFFFF; border-radius: 28px; overflow: hidden; border: 1px solid #C8D2A6; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #1D2E1B; padding: 32px 36px; text-align: center;">
              <table role="presentation" align="center" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #A9C632; width: 44px; height: 44px; border-radius: 14px; text-align: center; vertical-align: middle;">
                    <span style="font-size: 22px; font-weight: 900; color: #1D2E1B; line-height: 44px; display: inline-block;">F</span>
                  </td>
                  <td style="padding-left: 14px; text-align: left;">
                    <div style="font-size: 20px; font-weight: 900; letter-spacing: 1px; color: #FFFFFF; line-height: 1;">FINDELY</div>
                    <div style="font-size: 11px; font-weight: 700; color: #A9C632; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">Spatial Career Engine</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 36px;">
              <h2 style="font-size: 22px; font-weight: 900; color: #1D2E1B; margin: 0 0 12px 0;">Verify Your Identity</h2>
              <p style="font-size: 14px; line-height: 22px; color: #546E50; margin: 0 0 28px 0;">
                Hello <strong>${recipientName}</strong>,<br>
                Please use the following 6-digit verification code to authenticate your session on Findely.
              </p>

              <!-- OTP Code Display Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center" style="background-color: #F7F9F2; border: 2px dashed #A9C632; border-radius: 20px; padding: 24px 16px;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #546E50; margin-bottom: 8px;">Security Verification Code</div>
                    <div style="font-size: 38px; font-weight: 900; font-family: monospace; letter-spacing: 12px; color: #1D2E1B; text-indent: 12px;">${otpCode}</div>
                    <div style="font-size: 12px; font-weight: 600; color: #8F9E8B; margin-top: 10px;">Valid for 10 minutes</div>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; line-height: 20px; color: #546E50; margin: 0 0 20px 0;">
                Enter this code on Findely to confirm your Gmail and unlock direct ATS pipelines, 2.5D global maps, and your application tracking workspace.
              </p>

              <div style="border-top: 1px solid #EAEFEA; padding-top: 20px; margin-top: 20px;">
                <p style="font-size: 12px; line-height: 18px; color: #8F9E8B; margin: 0;">
                  If you didn't request this verification code, you can safely ignore this email. No action is required.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F7F9F2; padding: 20px 36px; border-top: 1px solid #C8D2A6; text-align: center;">
              <p style="font-size: 11px; font-weight: 600; color: #546E50; margin: 0;">
                Findely · 2.5D Frontier Career Navigator · Zero Recruiter Spam
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    // If SMTP credentials exist, send real email via transporter
    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to,
        subject: `Your Findely Verification Code: [ ${otpCode} ]`,
        text: `Your Findely verification code is ${otpCode}. It is valid for 10 minutes.`,
        html: htmlContent,
      });

      return { success: true };
    } else {
      // If SMTP credentials not provided in env, log to console for development verification
      console.log(`[AUTH-EMAIL-DISPATCH] Sent verification code [${otpCode}] to ${to}`);
      return { success: true };
    }
  } catch (err: any) {
    console.error("sendOtpEmail error:", err);
    return { success: false, error: err.message || "Failed to send email verification code" };
  }
}
