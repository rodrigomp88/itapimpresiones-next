const nodemailer = require('nodemailer');
require('dotenv').config({ path: './functions/.env.itap-shop' });

// Create transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test email
async function testEmail() {
  const mailOptions = {
    from: `"Test Itap Impresiones" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Send to yourself for testing
    subject: 'Test Email - Conexión de Correo',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">¡Test de Email Exitoso!</h1>
        <p>Este es un email de prueba para verificar la conexión de correo.</p>
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>Detalles de la Prueba</h3>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</p>
          <p><strong>Servidor:</strong> Gmail SMTP</p>
          <p><strong>Estado:</strong> ✅ Conectado correctamente</p>
        </div>
        <p>Si recibiste este email, la configuración está funcionando perfectamente.</p>
        <br>
        <p>Test Automático,<br>Itap Impresiones</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado exitosamente!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
  }
}

testEmail();
