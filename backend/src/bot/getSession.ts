import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import readline from 'readline';
import dotenv from 'dotenv';
dotenv.config();

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

const client = new TelegramClient(
  new StringSession(''),
  Number(process.env.TG_API_ID),
  process.env.TG_API_HASH!,
  { connectionRetries: 5 }
);

await client.start({
  phoneNumber: () => Promise.resolve(process.env.TG_PHONE!),
  password: () => Promise.resolve(''),
  phoneCode: () => ask('Код из Telegram: '),
  onError: console.error,
});

console.log('\n✅ Скопируй это в TG_SESSION в .env:');
console.log(client.session.save());
await client.disconnect();
