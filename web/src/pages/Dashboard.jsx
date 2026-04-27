import { useContext, useEffect, useMemo, useState } from 'react'
import AddExpenseModal from '../components/AddExpenseModal'
import SummaryCard from '../components/SummaryCard'
import { AuthContext } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { fetchItemsByType, addItem } from '../data/mockData'
import { addMonths, formatMonthYear } from '../utilities/dates'
import { formatMoney } from '../utilities/money'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

export default function DashboardPage() {
  const { user } = useContext(AuthContext)
  const { t } = useLocale()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [expenses, setExpenses] = useState([])
  const [staticIncomes, setStaticIncomes] = useState([])
  const [monthlyIncomes, setMonthlyIncomes] = useState([])
  const [staticExpenses, setStaticExpenses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      setStaticIncomes(await fetchItemsByType(user.uid, 'staticIncome'))
      setMonthlyIncomes(await fetchItemsByType(user.uid, 'monthlyIncome', currentMonth))
      setStaticExpenses(await fetchItemsByType(user.uid, 'staticExpense'))
      setExpenses(await fetchItemsByType(user.uid, 'monthlyExpense', currentMonth))
    }

    loadData()
  }, [user, currentMonth])

  const totalIncome = useMemo(
    () => [...staticIncomes, ...monthlyIncomes].reduce((sum, item) => sum + item.amount, 0),
    [staticIncomes, monthlyIncomes]
  )

  const totalStaticExpense = useMemo(
    () => staticExpenses.reduce((sum, item) => sum + item.amount, 0),
    [staticExpenses]
  )

  const totalMonthExpense = expenses.reduce((sum, item) => sum + item.amount, 0)
  const remaining = Math.max(0, totalIncome - totalStaticExpense - totalMonthExpense)

  const now = new Date()
  const isCurrentMonth =
    currentMonth.getMonth() === now.getMonth() &&
    currentMonth.getFullYear() === now.getFullYear()

  const pieColors = ['#66E588', '#d96060', '#d99040', '#6080b0', '#9060b0', '#c06090']

  const pieData = expenses.map((expense, index) => ({
  name: expense.name,
  value: expense.amount,
  color: pieColors[index % pieColors.length],
  }))

  const handleSaveExpense = async (expense) => {
    if (!user) return
    const saved = await addItem(user.uid, { ...expense, type: 'monthlyExpense' }, currentMonth)
    setExpenses((prev) => [saved, ...prev])
  }

  return (
  <section>
    <div className="page-header">
      <div>
        <h2>{t.dashboard}</h2>
        <p className="muted-text">{formatMonthYear(currentMonth)}</p>
      </div>

      <div className="header-actions">
        <button
          className="secondary-button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
        >
          Previous
        </button>

        <button
          className="secondary-button"
          onClick={() =>
            !isCurrentMonth &&
            setCurrentMonth(addMonths(currentMonth, 1))
          }
          disabled={isCurrentMonth}
        >
          Next
        </button>

        <button
          className="primary-button"
          onClick={() => setShowModal(true)}
        >
          Add Expense
        </button>
      </div>
    </div>

    <div className="summary-grid">
      <SummaryCard
        title={t.totalIncome}
        value={formatMoney(totalIncome)}
        tone="income"
      />

      <SummaryCard
        title={t.staticExpenses}
        value={formatMoney(totalStaticExpense)}
        tone="expense"
      />

      <SummaryCard
        title={t.monthlyExpenses}
        value={formatMoney(totalMonthExpense)}
        tone="expense"
      />

      <SummaryCard
        title={t.remaining}
        value={formatMoney(remaining)}
        tone="default"
      />
    </div>

    <div className="desktop-grid">
      <div className="panel large-panel">
        <h3>{t.expenses}</h3>

        {expenses.length === 0 ? (
          <p className="muted-text">
            {t.noExpensesThisMonth}
          </p>
        ) : (
          <div className="expense-list">
            {expenses.map((item) => {
              const selected = item.id === selectedId

              return (
                <button
                  key={item.id}
                  className={`expense-item ${
                    selected ? 'selected' : ''
                  }`}
                  onClick={() =>
                    setSelectedId(
                      selected ? null : item.id
                    )
                  }
                >
                  <div>
                    <strong>{item.name}</strong>

                    {item.description ? (
                      <p>{item.description}</p>
                    ) : null}
                  </div>

                  <span>
                    -{formatMoney(item.amount)}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="chart-box">
        {pieData.length === 0 ? (
          <p className="muted-text">
            No expenses to show
          </p>
        ) : (
          <PieChart width={420} height={320}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ value }) => `€${(value / 100).toFixed(2)}`}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                />
              ))}
            </Pie>

            <Tooltip formatter={(value) => `€${(value / 100).toFixed(2)}`} />

            <Legend />
          </PieChart>
        )}
      </div>
    </div>

    <AddExpenseModal
      open={showModal}
      onClose={() => setShowModal(false)}
      onSave={handleSaveExpense}
    />
  </section>
)}