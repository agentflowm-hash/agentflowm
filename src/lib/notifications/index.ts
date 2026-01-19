// ═══════════════════════════════════════════════════════════════
//                    NOTIFICATION SYSTEM
//                    Telegram & Discord Webhooks
// ═══════════════════════════════════════════════════════════════

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://agentflow.de';

// ═══════════════════════════════════════════════════════════════
//                    TELEGRAM
// ═══════════════════════════════════════════════════════════════

interface TelegramMessage {
  type: 'lead' | 'referral' | 'subscriber' | 'website-check';
  data: Record<string, any>;
}

export async function sendTelegramNotification(message: TelegramMessage): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('Telegram not configured, skipping notification');
    return false;
  }

  try {
    const text = formatTelegramMessage(message);
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      console.error('Telegram API error:', await response.text());
      return false;
    }

    console.log('✅ Telegram notification sent');
    return true;
  } catch (error) {
    console.error('Telegram notification failed:', error);
    return false;
  }
}

function formatTelegramMessage(message: TelegramMessage): string {
  const { type, data } = message;

  switch (type) {
    case 'lead':
      return `
🔥 <b>Neue Anfrage!</b>

👤 <b>${escapeHtml(data.name)}</b>
📧 ${escapeHtml(data.email)}
${data.phone ? `📱 ${escapeHtml(data.phone)}` : ''}
${data.company ? `🏢 ${escapeHtml(data.company)}` : ''}
${data.packageInterest ? `📦 ${escapeHtml(data.packageInterest)}` : ''}
${data.budget ? `💰 ${escapeHtml(data.budget)}` : ''}

💬 <i>${escapeHtml(truncate(data.message, 200))}</i>

<a href="${baseUrl}/admin">👉 Zum Dashboard</a>
      `.trim();

    case 'referral':
      return `
💜 <b>Neue Empfehlung!</b>

<b>Von:</b> ${escapeHtml(data.referrerName)}
📧 ${escapeHtml(data.referrerEmail)}

<b>Empfohlen:</b> ${escapeHtml(data.referredName)}
${data.referredEmail ? `📧 ${escapeHtml(data.referredEmail)}` : ''}
${data.referredCompany ? `🏢 ${escapeHtml(data.referredCompany)}` : ''}

<a href="${baseUrl}/admin">👉 Zum Dashboard</a>
      `.trim();

    case 'subscriber':
      return `
📬 <b>Neuer Newsletter-Subscriber!</b>

📧 ${escapeHtml(data.email)}

<a href="${baseUrl}/admin">👉 Zum Dashboard</a>
      `.trim();

    case 'website-check':
      return `
🌐 <b>Website-Check durchgeführt!</b>

🔗 ${escapeHtml(data.url)}
📊 Score: <b>${data.score}/100</b>
${data.email ? `📧 ${escapeHtml(data.email)}` : ''}

<a href="${baseUrl}/admin">👉 Zum Dashboard</a>
      `.trim();

    default:
      return 'Neue Benachrichtigung';
  }
}

// ═══════════════════════════════════════════════════════════════
//                    DISCORD
// ═══════════════════════════════════════════════════════════════

export async function sendDiscordNotification(message: TelegramMessage): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log('Discord not configured, skipping notification');
    return false;
  }

  try {
    const embed = formatDiscordEmbed(message);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'AgentFlow',
        avatar_url: `${baseUrl}/logo.png`,
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      console.error('Discord API error:', await response.text());
      return false;
    }

    console.log('✅ Discord notification sent');
    return true;
  } catch (error) {
    console.error('Discord notification failed:', error);
    return false;
  }
}

function formatDiscordEmbed(message: TelegramMessage): Record<string, any> {
  const { type, data } = message;

  const colors: Record<string, number> = {
    lead: 0xFC682C, // Orange
    referral: 0x9D65C9, // Purple
    subscriber: 0x22c55e, // Green
    'website-check': 0x06b6d4, // Cyan
  };

  const titles: Record<string, string> = {
    lead: '🔥 Neue Anfrage',
    referral: '💜 Neue Empfehlung',
    subscriber: '📬 Neuer Subscriber',
    'website-check': '🌐 Website-Check',
  };

  const fields: Record<string, any>[] = [];

  switch (type) {
    case 'lead':
      fields.push(
        { name: 'Name', value: data.name, inline: true },
        { name: 'Email', value: data.email, inline: true }
      );
      if (data.phone) fields.push({ name: 'Telefon', value: data.phone, inline: true });
      if (data.company) fields.push({ name: 'Unternehmen', value: data.company, inline: true });
      if (data.packageInterest) fields.push({ name: 'Interesse', value: data.packageInterest, inline: true });
      if (data.budget) fields.push({ name: 'Budget', value: data.budget, inline: true });
      if (data.message) fields.push({ name: 'Nachricht', value: truncate(data.message, 500) });
      break;

    case 'referral':
      fields.push(
        { name: 'Empfohlen von', value: `${data.referrerName}\n${data.referrerEmail}`, inline: true },
        { name: 'Empfohlene Person', value: `${data.referredName}\n${data.referredEmail || 'Keine E-Mail'}`, inline: true }
      );
      if (data.referredCompany) fields.push({ name: 'Unternehmen', value: data.referredCompany, inline: true });
      break;

    case 'subscriber':
      fields.push({ name: 'Email', value: data.email });
      break;

    case 'website-check':
      fields.push(
        { name: 'URL', value: data.url },
        { name: 'Score', value: `${data.score}/100`, inline: true }
      );
      if (data.email) fields.push({ name: 'Email', value: data.email, inline: true });
      break;
  }

  return {
    title: titles[type],
    color: colors[type],
    fields,
    timestamp: new Date().toISOString(),
    footer: {
      text: 'AgentFlow CRM',
    },
  };
}

// ═══════════════════════════════════════════════════════════════
//                    COMBINED NOTIFICATION
// ═══════════════════════════════════════════════════════════════

export async function sendNotification(message: TelegramMessage): Promise<void> {
  // Send to all configured channels in parallel
  await Promise.allSettled([
    sendTelegramNotification(message),
    sendDiscordNotification(message),
  ]);
}

// ═══════════════════════════════════════════════════════════════
//                    HELPERS
// ═══════════════════════════════════════════════════════════════

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
