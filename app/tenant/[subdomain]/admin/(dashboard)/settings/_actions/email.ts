'use server';

import { createClient } from '@/utils/supabase/server';
import nodemailer from 'nodemailer';

export async function sendTestEmail(tenantId: string, testEmail: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'SUPER_ADMIN' && profile.role !== 'ADMIN')) {
    return { success: false, error: 'Permissão negada.' };
  }

  const { data: tenantSettings, error: settingsError } = await supabase
    .from('tenant_settings')
    .select('email_smtp')
    .eq('tenant_id', tenantId)
    .single();

  if (settingsError || !tenantSettings?.email_smtp) {
    return { success: false, error: 'Configurações de SMTP não encontradas. Salve-as primeiro.' };
  }

  const smtp = tenantSettings.email_smtp;

  if (!smtp.host || !smtp.port || !smtp.username || !smtp.password || !smtp.fromEmail) {
    return { success: false, error: 'Configurações de SMTP incompletas. Preencha todos os campos obrigatórios e salve.' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: parseInt(smtp.port, 10),
      secure: smtp.encryption === 'ssl' || parseInt(smtp.port, 10) === 465, 
      auth: {
        user: smtp.username,
        pass: smtp.password,
      },
    });

    // Verify connection configuration
    await transporter.verify();

    // Send the test email
    await transporter.sendMail({
      from: `"${smtp.fromName || 'Sistema'}" <${smtp.fromEmail}>`,
      to: testEmail,
      subject: 'Teste de Integração SMTP - Sucesso!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #f59e0b;">Conexão SMTP Estabelecida! 🚀</h2>
          <p>Olá,</p>
          <p>Se você está recebendo este e-mail, significa que as configurações do seu servidor SMTP no painel do Redirecionador estão funcionando perfeitamente.</p>
          <p><strong>Detalhes da Configuração:</strong></p>
          <ul>
            <li><strong>Host:</strong> ${smtp.host}</li>
            <li><strong>Porta:</strong> ${smtp.port}</li>
            <li><strong>Usuário:</strong> ${smtp.username}</li>
          </ul>
          <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">Este é um e-mail automático gerado pelo sistema.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error('SMTP Test Error:', error);
    return { 
      success: false, 
      error: `Falha na conexão SMTP: ${error.message || 'Verifique suas credenciais e a porta utilizada.'}` 
    };
  }
}
