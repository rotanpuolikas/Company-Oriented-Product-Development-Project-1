export default function SummaryCard({ title, value, tone = 'default' }) {
  return (
    <div className={`summary-card ${tone}`}>
      <p className="summary-label">{title}</p>
      <h3 className="summary-value">{value}</h3>
    </div>
  )
} // tiivistelmä, joka näyttää onko positiiivisella vai negatiivisella budjetti