import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { fetchItemsByType, addItem, deleteItem } from '../data/mockData'
import { formatMoney, parseMoneyInput } from '../utilities/money'

export default function DeveloperPage() {
  const { user } = useContext(AuthContext)
  const [tab, setTab] = useState('add')
  const [isIncome, setIsIncome] = useState(true)
  const [isStatic, setIsStatic] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rawAmount, setRawAmount] = useState('')
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
        fetchItemsByType(user.uid, 'monthlyIncome'),
        fetchItemsByType(user.uid, 'monthlyExpense'),
      ])

      setData({ staticIncomes, staticExpenses, monthIncomes, monthExpenses })
    }

    loadData()
  }, [user])

  const handleAdd = async () => {
    const amount = parseMoneyInput(rawAmount)
    if (!name || !amount || !user) return

    const type = isIncome
      ? isStatic
        ? 'staticIncome'
        : 'monthlyIncome'
      : isStatic
        ? 'staticExpense'
        : 'monthlyExpense'

    const newItem = {
      name,
      description,
      amount,
      type,
    }

    const savedItem = await addItem(user.uid, newItem)
    const key = isIncome
      ? isStatic
        ? 'staticIncomes'
        : 'monthIncomes'
      : isStatic
        ? 'staticExpenses'
        : 'monthExpenses'

    setData((prev) => ({
      ...prev,
      [key]: [savedItem, ...prev[key]],
    }))

    setName('')
    setDescription('')
    setRawAmount('')
  }

  const currentList = listType.isIncome
    ? listType.isStatic
      ? data.staticIncomes
      : data.monthIncomes
    : listType.isStatic
      ? data.staticExpenses
      : data.monthExpenses

  const removeItem = async (id) => {
    if (!user) return
    await deleteItem(user.uid, id)

    const key = listType.isIncome
      ? listType.isStatic
        ? 'staticIncomes'
        : 'monthIncomes'
      : listType.isStatic
        ? 'staticExpenses'
        : 'monthExpenses'

    setData((prev) => ({
      ...prev,
      [key]: prev[key].filter((item) => item.id !== id),
    }))
  }
   return (
    <section>
      <div className="page-header">
        <div>
          <h2>Developer</h2>
          <p className="muted-text">Web version of your add/list tools.</p>
        </div>
      </div>

      <div className="toggle-row">
        <button className={tab === 'add' ? 'primary-button' : 'secondary-button'} onClick={() => setTab('add')}>
          Add
        </button>
        <button className={tab === 'list' ? 'primary-button' : 'secondary-button'} onClick={() => setTab('list')}>
          List
        </button>
      </div>

      {tab === 'add' ? (
        <div className="panel">
          <div className="toggle-row">
            <button className="secondary-button" onClick={() => setIsIncome(!isIncome)}>
              {isIncome ? 'Income' : 'Expense'}
            </button>
            <button className="secondary-button" onClick={() => setIsStatic(!isStatic)}>
              {isStatic ? 'Static' : 'Monthly'}
            </button>
          </div>

          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input placeholder="Amount" value={rawAmount} onChange={(e) => setRawAmount(e.target.value)} />
          <button className="primary-button" onClick={handleAdd}>Save</button>
        </div>
      ) : (
        <div className="panel">
          <div className="toggle-row">
            <button className="secondary-button" onClick={() => setListType((prev) => ({ ...prev, isIncome: !prev.isIncome }))}>
              {listType.isIncome ? 'Incomes' : 'Expenses'}
            </button>
            <button className="secondary-button" onClick={() => setListType((prev) => ({ ...prev, isStatic: !prev.isStatic }))}>
              {listType.isStatic ? 'Static' : 'Monthly'}
            </button>
          </div>
          <div className="simple-list">
            {currentList.length === 0 ? (
              <p className="muted-text">Nothing here yet.</p>
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
} // kehityssivu, jossa voi lisätä ja listata tuloja ja menoja ilman rajoituksia, tarkoitettu vain testailuun
