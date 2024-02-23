export function formatDollar(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDollarAmounts(amount: number, total: number) {
  const formattedAmount = Math.round(amount);
  const formattedTotal = Math.round(total);

  return `$${formattedAmount} out of $${formattedTotal}`;
}
