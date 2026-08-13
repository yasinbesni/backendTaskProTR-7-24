// src/helpers/sendHelpEmail.js
// Türkçe: Nodemailer kullanarak taskpro.project@gmail.com adresine e-posta gönderir.

import nodemailer from 'nodemailer';

export const getTransporter = async () => {
  // Check if SMTP config exists
  const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD;
  
  if (!hasSmtpConfig && process.env.NODE_ENV === 'production') {
    throw new Error('SMTP configuration is not set up. Please configure your email settings.');
  }

  // If no SMTP config in development, use test account
  if (!hasSmtpConfig && process.env.NODE_ENV !== 'production') {
    console.log('⚠️  Development mode: Creating test SMTP account');
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true' ? true : false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  console.log('✓ SMTP Configuration:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER?.substring(0, 5) + '***',
    to: process.env.SMTP_TO,
  });

  transporter.verify((err, success) => {
    if (err) console.error("❌ SMTP ERROR ---->", err);
    else console.log("✓ SMTP Connection OK");
  });

  return transporter;
};



export const sendHelpEmail = async (userEmail, comment) => {
  try {
    const transporter = await getTransporter();

    if (!process.env.SMTP_TO && process.env.NODE_ENV === 'production') {
      throw new Error('SMTP_TO email address is not configured');
    }

    const mailOptions = {
      from: `"TaskPro Yardım Talebi" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@taskpro.com'}>`,
      to: process.env.SMTP_TO || 'task@gmail.com',
      subject: 'TaskPro Yardım Talebi',
      html: `
        <h3>Yeni Yardım İsteği</h3>
        <p><strong>Kullanıcı E-posta:</strong> ${userEmail}</p>
        <p><strong>Yorum:</strong></p>
        <p>${comment}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✓ Help email sent successfully');
    console.log('Message ID:', info.messageId);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    } 
    const mailOptions2 = {
      from: `"TaskPro" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@taskpro.com'}>`,
      to: `${userEmail}`,
      subject: 'TaskPro destek talebiniz alındı',
      html: `
        <h3>TaskPro Destek Talebi</h3>
        <p><strong>Yasin</strong> (TaskPro)</p>
        <p>Öncelikle bizi tercih ettiğiniz için teşekkür ederiz.</p>
        <p>Destek talebiniz başarıyla alındı. En kısa sürede dönüş yapılacaktır.</p>
        <p><strong>Not:</strong> Bu e-posta otomatik olarak oluşturulmuştur. Lütfen cevaplamayınız.</p>
        <p><strong>Sağlıklı günler dileriz.</strong></p>
        <br />
        <p><strong>Saygılarımla</strong></p>
        <p><strong>Yasin</strong></p>
        <p>TaskPro Müşteri Hizmetleri</p>
      `,
    };
    await transporter.sendMail(mailOptions2);
  } catch (error) {
    console.error('❌ Error sending help email:', error.message);
    throw error;
  }
};
