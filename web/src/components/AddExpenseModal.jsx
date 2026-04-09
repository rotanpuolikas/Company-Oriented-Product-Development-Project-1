import { useState } from 'react'
import { parseMoneyInput } from '../utilities/money'

export default function AddExpenseModal({ open, onClose, onSave }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rawAmount, setRawAmount] = useState('')

  if (!open) return null

  const handleSubmit = () => {
    const amount = parseMoneyInput(rawAmount)
    if (!name || !amount) {
      onClose()
      return
    }

    onSave({
      id: crypto.randomUUID(),
      name,
      description,
      amount,
    })

    setName('')
    setDescription('')
    setRawAmount('')
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Add a new expense</h2>

        <input
          placeholder="Expense name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Amount"
          value={rawAmount}
          onChange={(e) => setRawAmount(e.target.value)}
        />

        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>Close</button>
          <button className="primary-button" onClick={handleSubmit}>Save Expense</button>
        </div>
      </div>
    </div>
  )
} // uuden menon lisäämiseen tarkoitettu modaalinen ikkunakomponentti