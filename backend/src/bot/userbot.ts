import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { NewMessage } from 'telegram/events/index.js';
import { parseReport } from './parser.js';
import { upsertSession } from '@/repositories/sessions.repository.js';
import { askCode } from '@/utils/askCode.js';
import { formatDate } from '@/utils/formatDate.js';

let client: TelegramClient | null = null;

function initUserbotClient(): TelegramClient {
  if (!client) {
    client = new TelegramClient(
      new StringSession(process.env.TG_SESSION ?? ''),
      Number(process.env.TG_API_ID),
      process.env.TG_API_HASH!,
      { connectionRetries: 5 }
    );
  }
  return client;
}

export async function startUserbot() {
  const userbotClient = initUserbotClient();

  await userbotClient.start({
    phoneNumber: () => Promise.resolve(process.env.TG_PHONE!),
    password: () => Promise.resolve(''),
    phoneCode: () => askCode(),
    onError: console.error,
  });

  console.log('🤖 Userbot запущен');

  userbotClient.addEventHandler(async (event) => {
    try {
      const text = event.message?.text ?? '';
      if (!text.includes('FSM PANEL | DROP REPORT')) return;

      const data = parseReport(text);
      if (!data) return;

      await upsertSession(data);
      console.log('✅ Сохранено:', data.date_from, '—', data.date_to);

      await event.message.respond({
        message:
          `✅ Сессия сохранена!\n` +
          `📅 ${formatDate(data.date_from)} — ${formatDate(data.date_to)}\n` +
          `💰 Total: ${data.total_value}$\n` +
          `📦 Cases: ${data.total_cases}\n` +
          `👤 Accounts: ${data.accounts_count}`,
      });
    } catch (error) {
      console.error('Failed to process Telegram drop report', error);
    }
  }, new NewMessage({}));
}
