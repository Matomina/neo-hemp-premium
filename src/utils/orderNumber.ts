export function generateOrderNumber(): string {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `CBD-${ymd}-${rand}`;
}
