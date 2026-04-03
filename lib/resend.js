import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'FlyPaar <onboarding@resend.dev>'
// Change to 'FlyPaar <noreply@flypaar.com>' after domain verification

export async function sendVerificationEmail({ to, firstName, verifyToken, manageToken }) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${verifyToken}`
  const manageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/manage/${manageToken}`

  await resend.emails.send({
    from: FROM_EMAIL,
    to: to,
    subject: 'Verify your FlyPaar trip posting',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Hi ${firstName}! ✈️</h2>
        
        <p>Thank you for posting on <strong>FlyPaar</strong>.</p>
        
        <p>Please verify your email to make your trip visible:</p>
        
        <a href="${verifyUrl}" 
           style="display: inline-block; background: #2563eb; color: white; 
                  padding: 12px 24px; border-radius: 8px; text-decoration: none;
                  margin: 16px 0;">
          ✅ Verify My Trip
        </a>
        
        <p style="margin-top: 24px; padding: 16px; background: #f0f9ff; border-radius: 8px;">
          <strong>📌 Save this link to manage your post later:</strong><br/>
          <a href="${manageUrl}">${manageUrl}</a><br/>
          <small>You can edit, mark as found, or delete your trip with this link.</small>
        </p>
        
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="color: #6b7280; font-size: 12px;">
          If you didn't post on FlyPaar, please ignore this email.
        </p>
      </div>
    `,
  })
}

export async function sendConnectionEmail({ 
  to, 
  posterFirstName, 
  senderName, 
  senderEmail, 
  senderPhone, 
  message, 
  tripFrom, 
  tripTo, 
  travelDate,
  flightNumber 
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: to,
    subject: `FlyPaar: Someone wants to connect - ${tripFrom} → ${tripTo}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Hi ${posterFirstName}! 🤝</h2>
        
        <p>Someone is interested in your trip on <strong>FlyPaar</strong>:</p>
        
        <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Your trip:</strong> ${tripFrom} → ${tripTo}</p>
          <p style="margin: 4px 0;"><strong>Date:</strong> ${travelDate}</p>
          ${flightNumber ? `<p style="margin: 4px 0;"><strong>Flight:</strong> ${flightNumber}</p>` : ''}
        </div>
        
        <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin-top: 0; color: #166534;">Contact Details:</h3>
          <p style="margin: 4px 0;"><strong>Name:</strong> ${senderName}</p>
          <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a></p>
          ${senderPhone ? `<p style="margin: 4px 0;"><strong>Phone:</strong> ${senderPhone}</p>` : ''}
          ${message ? `<p style="margin: 12px 0 4px 0;"><strong>Message:</strong></p><p style="margin: 4px 0; padding: 12px; background: white; border-radius: 4px;">${message}</p>` : ''}
        </div>
        
        <p style="color: #6b7280;">
          💡 <strong>Tip:</strong> You can contact them directly using the details above. 
          Please verify their identity before sharing sensitive information.
        </p>
        
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="color: #6b7280; font-size: 12px;">
          This email was sent because someone found your trip on FlyPaar.
          If you no longer want to receive connection requests, 
          you can delete your trip using your manage link.
        </p>
      </div>
    `,
  })
}