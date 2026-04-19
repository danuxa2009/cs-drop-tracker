export function formatDate(d: string): string {
  const [year, month, day] = d.split('-');
  return `${day}-${month}-${year}`;
}
