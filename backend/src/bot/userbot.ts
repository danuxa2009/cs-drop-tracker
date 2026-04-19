import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { NewMessage } from 'telegram/events/index.js';
import { parseReport } from './parser.js';
import { upsertSession } from '@/repositories/sessions.repository.js';
import { askCode } from '@/utils/askCode.js';
import { formatDate } from '@/utils/formatDate.js';

const client = new TelegramClient(
  new StringSession(process.env.TG_SESSION ?? ''),
  Number(process.env.TG_API_ID),
  process.env.TG_API_HASH!,
  { connectionRetries: 5 }
);

export async function startUserbot() {
  await client.start({
    phoneNumber: () => Promise.resolve(process.env.TG_PHONE!),
    password: () => Promise.resolve(''),
    phoneCode: () => askCode(),
    onError: console.error,
  });

  console.log('🤖 Userbot запущен');

  client.addEventHandler(async (event) => {
    const text = event.message?.text ?? '';
    if (!text.includes('FSM PANEL | DROP REPORT')) return;

    const data = parseReport(text);
    if (!data) return;

    await upsertSession(data);
    console.log('✅ Сохранено:', data.date_from, '—', data.date_to);
    await client.sendMessage(event.message.chatId!, {
      message:
        `✅ Сессия сохранена!\n` +
        `📅 ${formatDate(data.date_from)} — ${formatDate(data.date_to)}\n` +
        `💰 Total: ${data.total_value}$\n` +
        `📦 Cases: ${data.total_cases}\n` +
        `👤 Accounts: ${data.accounts_count}`,
    });
  }, new NewMessage({}));
}
