import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// ✅ SEND EMAIL UPDATE VERIFICATION (4-digit code)
export const sendEmailUpdateVerificationEmail = async (email, code) => {
  try {
    console.log('📧 EMAIL UPDATE VERIFICATION');
    console.log('🎯 To:', email);
    console.log('🔐 4-Digit Code:', code);
    console.log('⏰ Code expires in 10 minutes');
    console.log('---');

    // In development, just log to console
    // In production, this would send actual email
    
    return true;

  } catch (error) {
    console.error('❌ Email update verification error:', error);
    return true; // Return true for development
  }
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, code) => {
  try {
    console.log('📧 Attempting to send email to:', email);
    console.log('🔑 Verification code:', code);
    console.log('🔑 Resend API Key exists:', !!process.env.RESEND_API_KEY);
    console.log('🔑 Resend API Key length:', process.env.RESEND_API_KEY?.length);

    const { data, error } = await resend.emails.send({
      from: 'Roomi.pk <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify Your Roomi.pk Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 32px; font-weight: bold; }
            .content { padding: 40px; }
            .code-box { background: #f8f9fa; padding: 25px; border-radius: 12px; border: 3px dashed #667eea; text-align: center; margin: 30px 0; }
            .verification-code { font-size: 42px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: monospace; }
            .footer { background: #2d3748; padding: 20px; text-align: center; color: white; font-size: 12px; }
            .note { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 Roomi.pk</h1>
            </div>
            <div class="content">
              <h2 style="color: #2d3748; margin-bottom: 20px;">Verify Your Email</h2>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Hello!</p>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Thank you for using Roomi.pk! Use this verification code to complete your email change:</p>
              
              <div class="code-box">
                <div class="verification-code">${code}</div>
              </div>
              
              <div class="note">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  <strong>⚠️ Important:</strong> This code expires in <strong>8 minutes</strong>.
                </p>
              </div>
              
              <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                If you didn't request this email change, please contact support immediately.
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Roomi.pk. Find your perfect hostel in Pakistan.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      return false;
    }

    console.log('✅ Email sent successfully. Data:', data);
    return true;
  } catch (error) {
    console.error('❌ Email sending error:', error);
    console.error('❌ Error stack:', error.stack);
    return false;
  }
};

