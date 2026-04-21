export default {
  // Auth
  welcomeBack: 'Tervetuloa takaisin',
  createAccount: 'Luo tili',
  login: 'Kirjaudu sisään',
  loggingIn: 'Kirjaudutaan...',
  email: 'Sähköposti',
  password: 'Salasana',
  developerPassword: 'Kehittäjän salasana',
  alreadyHaveAccount: 'Onko sinulla jo tili? Kirjaudu sisään',
  dontHaveAccount: 'Eikö sinulla ole tiliä? Luo tili',

  // Auth errors
  invalidEmailOrPassword: 'Virheellinen sähköposti tai salasana',
  invalidDeveloperPassword: 'Virheellinen kehittäjän salasana',
  pleaseEnterEmailAndPassword: 'Syötä sähköposti ja salasana',
  emailAlreadyInUse: 'Sähköposti on jo käytössä',
  passwordTooShort: 'Salasanan täytyy olla vähintään 6 merkkiä',
  invalidEmail: 'Virheellinen sähköpostiosoite',
  couldNotCreateAccount: 'Tilin luominen epäonnistui',

  // Navigation
  home: 'Etusivu',
  settings: 'Asetukset',
  staticManagement: 'Kiinteät tulot ja menot',
  developer: 'Kehittäjä',
  logOut: 'Kirjaudu ulos',
  developerThings: 'Kehittäjän toiminnot',
  language: 'Kieli',

  // Dashboard
  dashboard: 'Etusivu',
  previous: 'Edellinen',
  next: 'Seuraava',
  addExpense: 'Lisää meno',
  totalIncome: 'Tulot yhteensä',
  staticExpenses: 'Kiinteät menot',
  monthlyExpenses: 'Kuukausittaiset menot',
  remaining: 'Jäljellä',
  expenses: 'Menot',
  noExpensesThisMonth: 'Ei menoja tällä kuulla',
  chartPlaceholder: 'Kaavio',

  // Settings
  settingsDesc: 'Perusasetukset.',
  manageStaticIncomesExpenses: 'Hallitse kiinteitä tuloja ja menoja',

  // Static Management
  staticManagementDesc: 'Hallitse kiinteitä tuloja ja menoja.',
  addStaticIncome: 'Lisää kiinteä tulo',
  addStaticExpense: 'Lisää kiinteä meno',
  staticIncomes: 'Kiinteät tulot',
  staticExpensesTitle: 'Kiinteät menot',
  noStaticIncomesYet: 'Ei vielä kiinteitä tuloja',
  noStaticExpensesYet: 'Ei vielä kiinteitä menoja',
  changeToExpense: 'Vaihda menoksi',
  changeToIncome: 'Vaihda tuloksi',
  saveStaticIncome: 'Tallenna kiinteä tulo',
  saveStaticExpense: 'Tallenna kiinteä meno',
  choosePreset: 'Valitse esimääritys...',
  hidePresets: 'Piilota esimääritykset',
  showPresets: 'Valitse esimääritys',
  fixed: 'kiinteä',
  enterAmount: 'syötä summa',

  // Preset names
  presetOpintotuki: 'Opintotuki',
  presetAsumislisa: 'Opintotuen asumislisä',
  presetRent: 'Vuokra',

  // Form fields
  incomeName: 'Tulon nimi',
  expenseName: 'Menon nimi',
  description: 'Kuvaus',
  amount: 'Summa',
  name: 'Nimi',
  nameLabel: 'nimi',
  save: 'Tallenna',
  addNew: 'Lisää uusi',
  add: 'Lisää',
  list: 'Listaa',
  close: 'Sulje',

  // Add Expense
  addNewExpense: 'Lisää uusi meno',
  saveExpense: 'Tallenna meno',

  // Developer
  developerDesc: 'Lisäys- ja listaustyökalut.',
  income: 'Tulo',
  expense: 'Meno',
  staticLabel: 'Kiinteä',
  monthly: 'Kuukausittainen',
  incomes: 'Tulot',
  nothingHereYet: 'Tyhjää täynnä.',

  // Type words used to build labels in DeveloperThings
  typeIncome: 'Tulo',
  typeExpense: 'Meno',
  typeStatic: 'Kiinteä',
  typeMonthly: 'Kuukausittainen',

  // Alerts
  error: 'Virhe',
  success: 'Onnistui',
  pleaseEnterNameAndAmount: 'Syötä nimi ja summa',
  expenseMustBeHigher: 'Menon täytyy olla suurempi kuin 0€',
  couldNotSave: 'Tallentaminen epäonnistui',
  couldNotSaveExpense: 'Menon tallentaminen epäonnistui',
  expenseAdded: 'Meno lisätty!',
  incomeSourceRemoved: 'Tulolähde poistettu!',
  couldNotRemoveIncomeSource: 'Tulolähteen poistaminen epäonnistui',
  expenseRemoved: 'Meno poistettu!',
  couldNotRemoveExpense: 'Menon poistaminen epäonnistui',

  // Dynamic
  itemAdded: (label) => `${label} lisätty!`,
  noItemsYet: (type, category) => `Ei vielä ${type} ${category}.`,
}
