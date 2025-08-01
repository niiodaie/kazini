// utils/sendConfirmationEmail.js
import { Resend } from 'resend';
const resend = re_V16xxz9y_2gwQGMrDdaqrSZx5sugfrpJi
export async function sendConfirmationEmail({ to, name, confirmUrl }) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Kazini <no-reply@visnec.ai>',
      to,
      subject: 'Confirm your Kazini account',
      html: `
        <h2>Hi ${name}, welcome to Kazini!</h2>
        <p>Click below to confirm your email:</p>
        <a href="${confirmUrl}" target="_blank">Confirm Email</a>
      `,
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('❌ Resend error:', err);
    throw new Error('Email failed');
  }
}
