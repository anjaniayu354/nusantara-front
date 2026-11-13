export const USD_RATE = 15300; // 1 USD = 15,300 IDR (configurable)

export function formatCurrency(amount: number, currency: "IDR" | "USD"): string {
  if (currency === "USD") {
    const usdVal = amount > 1000 ? Math.round(amount / USD_RATE) : amount;
    return `$${usdVal.toLocaleString("en-US")}`;
  }
  const idrVal = amount < 1000 ? Math.round(amount * USD_RATE) : amount;
  return `Rp ${idrVal.toLocaleString("id-ID")}`;
}
