export function addMonths(date, months) {
  const d = new Date(date)
  const dayOfMonth = d.getDate()
  d.setMonth(d.getMonth() + months)
  if (d.getDate() !== dayOfMonth) d.setDate(0)
  return d
}   // päiväys, johon on lisätty kuukausia

export function formatMonthYear(date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
} // päiväys muodossa "kuukausi vuosi" esimerkiksi "January 2024"