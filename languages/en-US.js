export default {
  // Auth
  welcomeBack: 'Welcome Back',
  createAccount: 'Create Account',
  login: 'Login',
  loggingIn: 'Logging in...',
  email: 'Email',
  password: 'Password',
  developerPassword: 'Developer password',
  alreadyHaveAccount: 'Already have an account? Login',
  dontHaveAccount: "Don't have an account? Create one",

  // Auth errors
  invalidEmailOrPassword: 'Invalid email or password',
  invalidDeveloperPassword: 'Invalid developer password',
  pleaseEnterEmailAndPassword: 'Please enter email and password',
  emailAlreadyInUse: 'Email already in use',
  passwordTooShort: 'Password must be at least 6 characters',
  invalidEmail: 'Invalid email address',
  couldNotCreateAccount: 'Could not create account',

  // Navigation
  home: 'Home',
  settings: 'Settings',
  staticManagement: 'Static Management',
  developer: 'Developer',
  logOut: 'Log out',
  developerThings: 'Developer things',
  language: 'Language',

  // Dashboard
  dashboard: 'Dashboard',
  previous: 'Previous',
  next: 'Next',
  addExpense: 'Add Expense',
  totalIncome: 'Total income',
  staticExpenses: 'Static expenses',
  monthlyExpenses: 'Monthly expenses',
  remaining: 'Remaining',
  expenses: 'Expenses',
  noExpensesThisMonth: 'No expenses this month',
  chartPlaceholder: 'Chart placeholder',

  // Settings
  settingsDesc: 'Basic settings.',
  manageStaticIncomesExpenses: 'Manage static incomes and expenses',

  // Static Management
  staticManagementDesc: 'Manage static incomes and expenses.',
  addStaticIncome: 'Add Static Income',
  addStaticExpense: 'Add Static Expense',
  staticIncomes: 'Static Incomes',
  staticExpensesTitle: 'Static Expenses',
  noStaticIncomesYet: 'No static incomes yet',
  noStaticExpensesYet: 'No static expenses yet',
  changeToExpense: 'Change to expense',
  changeToIncome: 'Change to income',
  saveStaticIncome: 'Save static income',
  saveStaticExpense: 'Save static expense',
  choosePreset: 'Choose a preset...',
  hidePresets: 'Hide presets',
  showPresets: 'Choose preset',
  fixed: 'fixed',
  enterAmount: 'enter amount',

  // Preset names
  presetOpintotuki: 'Opintotuki',
  presetAsumislisa: 'Opintotuen asumislisä',
  presetRent: 'Rent',

  // Form fields
  incomeName: 'Income name',
  expenseName: 'Expense name',
  description: 'Description',
  amount: 'Amount',
  name: 'Name',
  nameLabel: 'name',
  save: 'Save',
  addNew: 'Add New',
  add: 'Add',
  list: 'List',
  close: 'Close',

  // Add Expense
  addNewExpense: 'Add a new expense',
  saveExpense: 'Save Expense',

  // Developer
  developerDesc: 'Add/list tools.',
  income: 'Income',
  expense: 'Expense',
  staticLabel: 'Static',
  monthly: 'Monthly',
  incomes: 'Incomes',
  nothingHereYet: 'Nothing here yet.',

  // Type words used to build labels in DeveloperThings
  typeIncome: 'Income',
  typeExpense: 'Expense',
  typeStatic: 'Static',
  typeMonthly: 'Monthly',

  // Alerts
  error: 'Error',
  success: 'Success',
  pleaseEnterNameAndAmount: 'Please enter name and amount',
  expenseMustBeHigher: 'Expense must be higher than 0€',
  couldNotSave: 'Could not save',
  couldNotSaveExpense: 'Could not save expense',
  expenseAdded: 'Expense added!',
  incomeSourceRemoved: 'Income source removed!',
  couldNotRemoveIncomeSource: 'Could not remove income source',
  expenseRemoved: 'Expense removed!',
  couldNotRemoveExpense: 'Could not remove expense',

  // Dynamic
  itemAdded: (label) => `${label} added!`,
  noItemsYet: (type, category) => `No ${type} ${category} yet.`,
}
