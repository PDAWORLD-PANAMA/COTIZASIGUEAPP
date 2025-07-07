

// index.js

import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
app.use(bodyParser.json());
console.log("Loaded API Key:", process.env.RESEND_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/send-auth-email', async (req, res) => {
  const { uuid, code, cedula, nombre, phone } = req.body;

  try {
    const result = await resend.emails.send({
      from: 'YourApp <onboarding@resend.dev>', // ✅ Use Resend's test sender
      to: ['pdaworldfdwpanama@gmail.com'],
      subject: 'Código de autorización de instalación',
      html: `
        <h2>Solicitud de autorización</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Cédula:</strong> ${cedula}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>UUID:</strong> ${uuid}</p>
        <p><strong>Código:</strong> <code>${code}</code></p>
      `
    });

    res.status(200).json({ success: true, id: result.id });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3500, '0.0.0.0', () => {
  console.log('✅ Node.js backend running on http://192.168.1.200:3500');
});
