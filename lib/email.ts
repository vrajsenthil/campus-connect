import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, school: string, destination: string) {
  try {
    // Get school display names
    const schoolNames: { [key: string]: string } = {
      uiuc: 'University of Illinois Urbana-Champaign (UIUC)',
      iu: 'Indiana University Bloomington (IU)',
      purdue: 'Purdue University',
    }

    const schoolName = schoolNames[school] || school
    const destinationName = schoolNames[destination] || destination

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'UniLink <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to UniLink! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to UniLink</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 20px; text-align: center; background-color: #1e293b;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">UniLink</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 20px; background-color: #ffffff; max-width: 600px; margin: 0 auto;">
                  <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px;">Welcome to UniLink! 🎉</h2>
                  
                  <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    Thank you for joining the UniLink waitlist! We're excited to have you on board.
                  </p>
                  
                  <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0 0 10px 0; color: #1e40af; font-weight: 600; font-size: 14px;">YOUR INTEREST</p>
                    <p style="margin: 0; color: #1e293b; font-size: 16px;">
                      <strong>School:</strong> ${schoolName}<br>
                      <strong>Destination:</strong> ${destinationName}
                    </p>
                  </div>
                  
                  <p style="margin: 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    We're working hard to launch UniLink and connect students across college campuses. As a waitlist member, you'll be among the first to know when we go live and get early access to book your first trip.
                  </p>
                  
                  <p style="margin: 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    In the meantime, feel free to share UniLink with your friends who might be interested in affordable inter-campus transportation!
                  </p>
                  
                  <div style="margin: 30px 0; text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}" 
                       style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Visit UniLink
                    </a>
                  </div>
                  
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                  
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                    If you have any questions, just reply to this email. We're here to help!<br><br>
                    Best regards,<br>
                    <strong>The UniLink Team</strong>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; text-align: center; background-color: #f9fafb; color: #6b7280; font-size: 12px;">
                  <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} UniLink. All rights reserved.</p>
                  <p style="margin: 0;">Connecting students across college campuses</p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error }
  }
}
