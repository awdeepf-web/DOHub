/**
 * Ubah string bulan "2026-08" jadi rentang tanggal awal & akhir bulan tsb.
 * Dipakai untuk filter laporan per periode.
 */
export function getMonthRange(monthStr: string): { from: string; to: string } {
  const [yearStr = '', monthNumStr = ''] = monthStr.split('-');
  const year = Number(yearStr);
  const monthNum = Number(monthNumStr);

  const from = `${yearStr}-${monthNumStr}-01`;
  const lastDay = new Date(year, monthNum, 0).getDate();
  const to = `${yearStr}-${monthNumStr}-${String(lastDay).padStart(2, '0')}`;

  return { from, to };
}

export function getCurrentMonthValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getMonthLabel(monthStr: string): string {
  const [yearStr = '0', monthStrVal = '1'] = monthStr.split('-');
  const year = Number(yearStr);
  const month = Number(monthStrVal);

  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
}