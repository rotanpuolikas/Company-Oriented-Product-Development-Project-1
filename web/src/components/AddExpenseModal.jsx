import { useState } from 'react'
import { parseMoneyInput } from '../utilities/money'
import { useLocale } from '../context/LocaleContext'

export default function AddExpenseModal({ open, onClose, onSave }) {
  const { t } = useLocale()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rawAmount, setRawAmount] = useState('')

  if (!open) return null

  const handleSubmit = () => {
    const amount = parseMoneyInput(rawAmount)

    if (!name || !amount) return

    onSave({ name, description, amount })

    setName('')
    setDescription('')
    setRawAmount('')
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>{t.addNewExpense}</h2>

        <div className="form-row">
          <input
            placeholder={t.expenseName}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder={t.description}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            placeholder={t.amount}
            value={rawAmount}
            onChange={(e) => setRawAmount(e.target.value)}
          />

          <div className="modal-actions">
            <button className="secondary-button" onClick={onClose}>
              {t.close}
            </button>

            <button className="primary-button" onClick={handleSubmit}>
              {t.saveExpense}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}