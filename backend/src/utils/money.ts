export const centsToEuros = (cents: number) => cents / 100;
export const eurosToCents = (euros: number) => Math.round(euros * 100);
export const formatEuros = (cents: number) =>
  (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
