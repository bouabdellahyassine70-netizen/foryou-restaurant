/**
 * Format price in Moroccan Dirham (MAD)
 * @param price - Price as number or string
 * @returns Formatted price string like "45 DH" or "120 DH"
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '0 DH';
  return `${Math.round(numPrice)} DH`;
}

/**
 * Format price with decimals (if needed)
 * @param price - Price as number or string
 * @returns Formatted price string like "45.50 DH"
 */
export function formatPriceDecimal(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '0.00 DH';
  return `${numPrice.toFixed(2)} DH`;
}
