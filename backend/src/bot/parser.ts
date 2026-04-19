import { CreateSessionDTO } from '@/types/sessions.types.js';

function parseDate(d: string): string {
  const [day, month, year] = d.split('.');
  return `${year}-${month}-${day}`;
}

function parseTableRows(section: string): RegExpMatchArray[] {
  return [...section.matchAll(/^([^-][^\n]+?)\s*\|\s*(\d+)\s*\|\s*(\d+(?:\.\d+)?)\s*$/gm)];
}

export function parseReport(text: string): CreateSessionDTO | null {
  try {
    const dateMatch = text.match(/Date:\s*(\d{2}\.\d{2}\.\d{4})\s*-\s*(\d{2}\.\d{2}\.\d{4})/);
    const accountsMatch = text.match(/Accounts:\s*(\d+)/);
    const totalMatch = text.match(/Price of all drop:\s*~?\s*(\d+(?:\.\d+)?)\$/);
    const casesMatch = text.match(/Total cases:\s*(\d+)/);
    const avgMatch = text.match(
      /AVG price of cases\/all drop:\s*(\d+(?:\.\d+)?)\$\/(\d+(?:\.\d+)?)\$/
    );

    if (!dateMatch || !accountsMatch || !totalMatch || !casesMatch || !avgMatch) {
      return null;
    }

    const dropsSectionMatch = text.match(/Case\s*\|[^\n]*\n-[^\n]*\n([\s\S]*?)\n-[^\n]*\n/);
    const drops = dropsSectionMatch
      ? parseTableRows(dropsSectionMatch[1]).map((row) => ({
          case_name: row[1].trim(),
          amount: Number(row[2]),
          percentage: Number(row[3]),
        }))
      : [];

    const skinsSectionMatch = text.match(/Skin[^\n]*\n-[^\n]*\n([\s\S]*?)\n-[^\n]*\n/);
    const skins = skinsSectionMatch
      ? [
          ...skinsSectionMatch[1].matchAll(/^(.+\|.+?)\s*\|\s*(\d+)\s*\|\s*(\d+(?:\.\d+)?)\s*$/gm),
        ].map((row) => ({
          skin_name: row[1].trim(),
          amount: Number(row[2]),
          price: Number(row[3]),
        }))
      : undefined;

    if (dropsSectionMatch && drops.length === 0) {
      return null;
    }

    const accountsCount = Number(accountsMatch[1]);
    const totalValue = Number(totalMatch[1]);
    const totalCases = Number(casesMatch[1]);
    const avgCasePrice = Number(avgMatch[1]);
    const avgDropPrice = Number(avgMatch[2]);

    const numericFields = [accountsCount, totalValue, totalCases, avgCasePrice, avgDropPrice];
    if (numericFields.some((n) => Number.isNaN(n) || !Number.isFinite(n))) {
      return null;
    }

    // Validate drops numeric fields
    if (
      drops.some(
        (d) =>
          Number.isNaN(d.amount) ||
          !Number.isFinite(d.amount) ||
          Number.isNaN(d.percentage) ||
          !Number.isFinite(d.percentage)
      )
    ) {
      return null;
    }

    if (
      skins?.some(
        (s) =>
          Number.isNaN(s.amount) ||
          !Number.isFinite(s.amount) ||
          Number.isNaN(s.price) ||
          !Number.isFinite(s.price)
      )
    ) {
      return null;
    }

    return {
      date_from: parseDate(dateMatch[1]),
      date_to: parseDate(dateMatch[2]),
      accounts_count: accountsCount,
      total_value: totalValue,
      total_cases: totalCases,
      avg_case_price: avgCasePrice,
      avg_drop_price: avgDropPrice,
      is_final: false,
      drops,
      skins,
    };
  } catch {
    return null;
  }
}
