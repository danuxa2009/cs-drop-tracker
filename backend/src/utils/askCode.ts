import readline from 'readline';
export function askCode(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question('Код из Telegram: ', (code) => {
      rl.close();
      resolve(code);
    });
  });
}
