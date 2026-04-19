import { CreateSessionDTO } from '@/types/sessions.types.js';

function parseDate(d: string): string {
  const [day, month, year] = d.split('.');
  return `${year}-${month}-${day}`;
}

function parseTableRows(section: string): RegExpMatchArray[] {
  return [...section.matchAll(/^([^-][^\n]+?)\s*\|\s*(\d+)\s*\|\s*([\d.]+)\s*$/gm)];
}

export function parseReport(text: string): CreateSessionDTO | null {
  try {
    const dateMatch = text.match(/Date:\s*(\d{2}\.\d{2}\.\d{4})\s*-\s*(\d{2}\.\d{2}\.\d{4})/);
    const accountsMatch = text.match(/Accounts:\s*(\d+)/);
    const totalMatch = text.match(/Price of all drop:\s*~?\s*([\d.]+)\$/);
    const casesMatch = text.match(/Total cases:\s*(\d+)/);
    const avgMatch = text.match(/AVG price of cases\/all drop:\s*([\d.]+)\$\/([\d.]+)\$/);

    if (!dateMatch || !accountsMatch || !totalMatch || !casesMatch || !avgMatch) {
      return null;
    }

    // Вырезаем секцию кейсов — между первой парой ---
    const dropsSectionMatch = text.match(/Case\s*\|[^\n]*\n-[^\n]*\n([\s\S]*?)\n-[^\n]*\n/);
    const drops = dropsSectionMatch
      ? parseTableRows(dropsSectionMatch[1]).map((row) => ({
          case_name: row[1].trim(),
          amount: Number(row[2]),
          percentage: Number(row[3]),
        }))
      : [];

    // Вырезаем секцию скинов — между второй парой ---
    const skinsSectionMatch = text.match(/Skin[^\n]*\n-[^\n]*\n([\s\S]*?)\n-[^\n]*\n/);
    const skins = skinsSectionMatch
      ? [...skinsSectionMatch[1].matchAll(/^(.+\|.+?)\s*\|\s*(\d+)\s*\|\s*([\d.]+)\s*$/gm)].map(
          (row) => ({
            skin_name: row[1].trim(),
            amount: Number(row[2]),
            price: Number(row[3]),
          })
        )
      : undefined;

    return {
      date_from: parseDate(dateMatch[1]),
      date_to: parseDate(dateMatch[2]),
      accounts_count: Number(accountsMatch[1]),
      total_value: Number(totalMatch[1]),
      total_cases: Number(casesMatch[1]),
      avg_case_price: Number(avgMatch[1]),
      avg_drop_price: Number(avgMatch[2]),
      is_final: false,
      drops,
      skins,
    };
  } catch {
    return null;
  }
}
