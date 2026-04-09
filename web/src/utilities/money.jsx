export function parseMoneyInput(raw) {
  if (!raw) return 0

  let cleaned = raw.trim().replace(/\s/g, '')

  if (cleaned.includes(',') && cleaned.includes('.')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.')
  } else {
    cleaned = cleaned.replace(',', '.')
  }

  const value = parseFloat(cleaned)
  if (Number.isNaN(value)) return 0

  return Math.floor(value * 100)
}

export function formatMoney(cents) {
  return `€${(cents / 100).toFixed(2)}`
}