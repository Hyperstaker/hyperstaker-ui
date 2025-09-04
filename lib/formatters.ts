export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function formatAllocationNumber(value: string | number): string {
  // Convert to number, divide by 100000, and format as USD
  const num = Number(value) / 100000;
  return formatCurrency(num);
}