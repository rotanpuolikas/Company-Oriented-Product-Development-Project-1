import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { fetchItemsByType, addItem } from '../data/mockData'
import { parseMoneyInput, formatMoney } from '../utilities/money'

export default function StaticManagementPage() {
  const { user } = useContext(AuthContext)
  const [isIncome, setIsIncome] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rawAmount, setRawAmount] = useState('')
  const [items, setItems] = useState({ incomes: [], expenses: [] })

  useEffect(() => {
    if (!user) return

    const loadItems = async () => {
      const incomes = await fetchItemsByType(user.uid, 'staticIncome')
      const expenses = await fetchItemsByType(user.uid, 'staticExpense')
      setItems({ incomes, expenses })
    }

    loadItems()
  }, [user])

  const handleAdd = async () => {
    const amount = parseMoneyInput(rawAmount)
    if (!name || !amount || !user) return

    const type = isIncome ? 'staticIncome' : 'staticExpense'
    const newItem = {
      name,
      description,
      amount,
      type,
    }

    const savedItem = await addItem(user.uid, newItem)

    setItems((prev) => ({
      incomes: isIncome ? [savedItem, ...prev.incomes] : prev.incomes,
      expenses: !isIncome ? [savedItem, ...prev.expenses] : prev.expenses,
    }))

    setName('')
    setDescription('')
    setRawAmount('')
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Static Management</h2>
          <p className="muted-text">Manage static incomes and expenses for web.</p>
        </div>
      </div>

      <div className="desktop-grid">
        <div className="panel">
          <div className="toggle-row">
            <button className="secondary-button" onClick={() => setIsIncome(!isIncome)}>
              Change to {isIncome ? 'expense' : 'income'}
            </button>
          </div>

          <h3>Add Static {isIncome ? 'Income' : 'Expense'}</h3>

          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input placeholder="Amount" value={rawAmount} onChange={(e) => setRawAmount(e.target.value)} />

          <button className="primary-button" onClick={handleAdd}>
            Save static {isIncome ? 'income' : 'expense'}
          </button>
        </div>
         <div className="panel">
          <h3>Static Incomes</h3>
          <div className="simple-list">
            {items.incomes.map((item) => (
              <div key={item.id} className="list-card income-border">
                <div className="row-between">
                  <strong>{item.name}</strong>
                  <span>{formatMoney(item.amount)}</span>
                </div>
                {item.description ? <p>{item.description}</p> : null}
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: 24 }}>Static Expenses</h3>
          <div className="simple-list">
            {items.expenses.map((item) => (
              <div key={item.id} className="list-card expense-border">
                <div className="row-between">
                  <strong>{item.name}</strong>
                  <span>{formatMoney(item.amount)}</span>
                </div>
                {item.description ? <p>{item.description}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} // staattisten tulojen ja menojen hallintasivu, jossa voi lisätä uusia ja nähdä vanhat
