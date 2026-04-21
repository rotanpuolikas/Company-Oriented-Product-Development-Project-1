import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { fetchItemsByType, addItem } from '../data/mockData'
import { parseMoneyInput, formatMoney } from '../utilities/money'

export default function StaticManagementPage() {
  const { user } = useContext(AuthContext)
  const { t } = useLocale()
  const [isIncome, setIsIncome] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rawAmount, setRawAmount] = useState('')
  const [items, setItems] = useState({ incomes: [], expenses: [] })

  const presets = {
    income: [
      { name: t.presetOpintotuki, amount: 27900 },
      { name: t.presetAsumislisa, amount: null },
    ],
    expense: [
      { name: t.presetRent, amount: null },
    ],
  }

  useEffect(() => {
    if (!user) return

    const loadItems = async () => {
      const incomes = await fetchItemsByType(user.uid, 'staticIncome')
      const expenses = await fetchItemsByType(user.uid, 'staticExpense')
      setItems({ incomes, expenses })
    }

    loadItems()
  }, [user])

  const handlePresetChange = (e) => {
    const value = e.target.value
    if (!value) return
    const list = isIncome ? presets.income : presets.expense
    const preset = list.find((p) => p.name === value)
    if (!preset) return
    setName(preset.name)
    setRawAmount(preset.amount !== null ? (preset.amount / 100).toFixed(2) : '')
    e.target.value = ''
  }

  const handleAdd = async () => {
    const amount = parseMoneyInput(rawAmount)
    if (!name || !amount || !user) return

    const type = isIncome ? 'staticIncome' : 'staticExpense'
    const newItem = { name, description, amount, type }

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
          <h2>{t.staticManagement}</h2>
          <p className="muted-text">{t.staticManagementDesc}</p>
        </div>
      </div>

      <div className="desktop-grid">
        <div className="panel">
          <div className="toggle-row">
            <button className="secondary-button" onClick={() => setIsIncome(!isIncome)}>
              {isIncome ? t.changeToExpense : t.changeToIncome}
            </button>
          </div>

          <h3>{isIncome ? t.addStaticIncome : t.addStaticExpense}</h3>

          <select
            defaultValue=""
            onChange={handlePresetChange}
            style={{ marginBottom: 12 }}
          >
            <option value="" disabled>{t.choosePreset}</option>
            {(isIncome ? presets.income : presets.expense).map((preset) => (
              <option key={preset.name} value={preset.name}>
                {preset.name}
                {preset.amount !== null
                  ? ` — €${(preset.amount / 100).toFixed(2)} (${t.fixed})`
                  : ` — ${t.enterAmount}`}
              </option>
            ))}
          </select>

          <input placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} />
          <textarea placeholder={t.description} value={description} onChange={(e) => setDescription(e.target.value)} />
          <input placeholder={t.amount} value={rawAmount} onChange={(e) => setRawAmount(e.target.value)} />

          <button className="primary-button" onClick={handleAdd}>
            {isIncome ? t.saveStaticIncome : t.saveStaticExpense}
          </button>
        </div>

        <div className="panel">
          <h3>{t.staticIncomes}</h3>
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
            {items.incomes.length === 0 && <p className="muted-text">{t.noStaticIncomesYet}</p>}
          </div>

          <h3 style={{ marginTop: 24 }}>{t.staticExpensesTitle}</h3>
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
            {items.expenses.length === 0 && <p className="muted-text">{t.noStaticExpensesYet}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
