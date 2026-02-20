export const otpEmailTemplate = (name, otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f4f8; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 30px; text-align:center;">
              <div style="width:64px; height:64px; background:rgba(255,255,255,0.2); border-radius:50%; margin: 0 auto 16px; display:flex; align-items:center; justify-content:center;">
                <span style="font-size:28px;">🔐</span>
              </div>
              <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700; letter-spacing:-0.5px;">Verify Your Email</h1>
              <p style="color:rgba(255,255,255,0.8); margin:8px 0 0; font-size:14px;">One step away from getting started</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 40px;">

              <p style="color:#374151; font-size:16px; margin:0 0 8px;">
                Hi <strong>${name}</strong> 👋
              </p>
              <p style="color:#6b7280; font-size:15px; line-height:1.6; margin:0 0 28px;">
                Thanks for signing up! Please use the verification code below to confirm your email address. This code is valid for <strong>10 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <div style="background: linear-gradient(135deg, #f0f4ff 0%, #faf0ff 100%); border: 2px dashed #667eea; border-radius:12px; padding: 28px 20px; display:inline-block;">
                      <p style="color:#9ca3af; font-size:12px; text-transform:uppercase; letter-spacing:2px; margin:0 0 10px;">Your Verification Code</p>
                      <p style="margin:0; font-size:42px; font-weight:800; letter-spacing:12px; color:#4f46e5; font-family:'Courier New', monospace;">${otp}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Warning Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#fff7ed; border-left:4px solid #f59e0b; border-radius:0 8px 8px 0; padding:14px 16px;">
                    <p style="margin:0; color:#92400e; font-size:13px; line-height:1.5;">
                      ⚠️ <strong>Never share this code</strong> with anyone. Our team will never ask for your OTP.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color:#9ca3af; font-size:13px; line-height:1.5; margin:0;">
                If you didn't create an account, you can safely ignore this email. Someone may have entered your email address by mistake.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border:none; border-top:1px solid #e5e7eb; margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; text-align:center;">
              <p style="color:#9ca3af; font-size:12px; margin:0 0 4px;">
                This email was sent automatically. Please do not reply.
              </p>
              <p style="color:#d1d5db; font-size:11px; margin:0;">
                © ${new Date().getFullYear()} YourApp. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- End Card -->

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};