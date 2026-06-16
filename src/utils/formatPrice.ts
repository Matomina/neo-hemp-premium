export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}
export function formatPriceRaw(euros: number): string {
  return euros.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}
