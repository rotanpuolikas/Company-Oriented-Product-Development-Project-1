import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { fetchItemsByType, addItem, deleteItem } from '../data/mockData'
import { formatMoney, parseMoneyInput } from '../utilities/money'
import { addMonths, formatMonthYear } from '../utilities/dates'

export default function DeveloperPage() {
  const { user } = useContext(AuthContext)
  const { t } = useLocale()
  const [tab, setTab] = useState('add')
  const [isIncome, setIsIncome] = useState(true)
  const [isStatic, setIsStatic] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rawAmount, setRawAmount] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [listType, setListType] = useState({ isIncome: false, isStatic: false })
  const [data, setData] = useState({
    staticIncomes: [],
    staticExpenses: [],
    monthIncomes: [],
    monthExpenses: [],
  })

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      const [staticIncomes, staticExpenses, monthIncomes, monthExpenses] = await Promise.all([
        fetchItemsByType(user.uid, 'staticIncome'),
        fetchItemsByType(user.uid, 'staticExpense'),
        fetchItemsByType(user.uid, 'monthlyIncome', currentMonth),
        fetchItemsByType(user.uid, 'monthlyExpense', currentMonth),
      ])

      setData({ staticIncomes, staticExpenses, monthIncomes, monthExpenses })
    }

    loadData()
  }, [user, currentMonth])

  const handleAdd = async () => {
    const amount = parseMoneyInput(rawAmount)
    if (!name || !amount || !user) return

    const type = isIncome
      ? isStatic ? 'staticIncome' : 'monthlyIncome'
      : isStatic ? 'staticExpense' : 'monthlyExpense'

    const month = isStatic ? undefined : currentMonth
    const newItem = { name, description, amount, type }
    const savedItem = await addItem(user.uid, newItem, month)
    const key = isIncome
      ? isStatic ? 'staticIncomes' : 'monthIncomes'
      : isStatic ? 'staticExpenses' : 'monthExpenses'

    setData((prev) => ({ ...prev, [key]: [savedItem, ...prev[key]] }))
    setName('')
    setDescription('')
    setRawAmount('')
  }

  const currentList = listType.isIncome
    ? listType.isStatic ? data.staticIncomes : data.monthIncomes
    : listType.isStatic ? data.staticExpenses : data.monthExpenses

  const removeItem = async (id) => {
    if (!user) return
    const type = listType.isIncome
      ? listType.isStatic ? 'staticIncome' : 'monthlyIncome'
      : listType.isStatic ? 'staticExpense' : 'monthlyExpense'
    const month = listType.isStatic ? undefined : currentMonth
    await deleteItem(user.uid, id, type, month)

    const key = listType.isIncome
      ? listType.isStatic ? 'staticIncomes' : 'monthIncomes'
      : listType.isStatic ? 'staticExpenses' : 'monthExpenses'

    setData((prev) => ({ ...prev, [key]: prev[key].filter((item) => item.id !== id) }))
  }

  const now = new Date()
  const isCurrentMonth =
    currentMonth.getMonth() === now.getMonth() &&
    currentMonth.getFullYear() === now.getFullYear()

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>{t.developer}</h2>
          <p className="muted-text">{t.developerDesc}</p>
        </div>
      </div>

      <div className="toggle-row">
        <button className={tab === 'add' ? 'primary-button' : 'secondary-button'} onClick={() => setTab('add')}>
          {t.add}
        </button>
        <button className={tab === 'list' ? 'primary-button' : 'secondary-button'} onClick={() => setTab('list')}>
          {t.list}
        </button>
      </div>

      {tab === 'add' ? (
        <div className="panel">
          <div className="toggle-row">
            <button className="secondary-button" onClick={() => setIsIncome(!isIncome)}>
              {isIncome ? t.income : t.expense}
            </button>
            <button className="secondary-button" onClick={() => setIsStatic(!isStatic)}>
              {isStatic ? t.staticLabel : t.monthly}
            </button>
          </div>

          <input placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} />
          <textarea placeholder={t.description} value={description} onChange={(e) => setDescription(e.target.value)} />
          <input placeholder={t.amount} value={rawAmount} onChange={(e) => setRawAmount(e.target.value)} />
          <button className="primary-button" onClick={handleAdd}>{t.save}</button>
        </div>
      ) : (
        <div className="panel">
          <div className="toggle-row">
            <button className="secondary-button" onClick={() => setListType((prev) => ({ ...prev, isIncome: !prev.isIncome }))}>
              {listType.isIncome ? t.incomes : t.expenses}
            </button>
            <button className="secondary-button" onClick={() => setListType((prev) => ({ ...prev, isStatic: !prev.isStatic }))}>
              {listType.isStatic ? t.staticLabel : t.monthly}
            </button>
          </div>

          {!listType.isStatic && (
            <div className="toggle-row" style={{ marginBottom: 12 }}>
              <button className="secondary-button" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}>
                {t.previous}
              </button>
              <span>{formatMonthYear(currentMonth)}</span>
              <button
                className="secondary-button"
                onClick={() => !isCurrentMonth && setCurrentMonth(addMonths(currentMonth, 1))}
                disabled={isCurrentMonth}
              >
                {t.next}
              </button>
            </div>
          )}

          <div className="simple-list">
            {currentList.length === 0 ? (
              <p className="muted-text">{t.nothingHereYet}</p>
            ) : (
              currentList.map((item) => (
                <div key={item.id} className="list-card">
                  <div className="row-between">
                    <strong>{item.name}</strong>
                    <button className="icon-button" onClick={() => removeItem(item.id)}>
                      ×
                    </button>
                  </div>
                  {item.description ? <p>{item.description}</p> : null}
                  <span>{formatMoney(item.amount)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  )
}
