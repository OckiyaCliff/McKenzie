export const TOKEN_TO_GBP_RATE = 520 // 1 token = £520

export function fiatToTokens(amount: number): number {
  return Number((amount / TOKEN_TO_GBP_RATE).toFixed(2))
}

export function tokensToFiat(tokens: number): number {
  return Number((tokens * TOKEN_TO_GBP_RATE).toFixed(2))
}

export function formatTokens(tokens: number): string {
  return `${tokens.toLocaleString()} TKN`
}

export function formatFiat(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount)
}

export function validateBidAmount(currentBid: number, newBid: number): boolean {
  const minIncrement = currentBid * 0.05 // 5% minimum increment
  return newBid >= currentBid + minIncrement
}
