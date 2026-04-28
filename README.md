# MassiMappi

## perusinfot

toteutettu käyttäen Expoa, `expo@54.0.33` to be exact.

web-versio löytyy subfolderista `web/`, siellä on oma readme

## firebase setup

ota firebasessa käyttöön email autentikaatio, tämä mahdollistaa sisäänkirjautumisen ja tilien luonnin firebasen kautta.

tee projektin alimmalle tasolle tiedosto nimeltään `firebaseConfig.js`, jonka tulee sisältää tämä:


```
export const firebaseConfig = {
  apiKey: 'replace-me',
  authDomain: 'replace-me',
  projectId: 'replace-me',
  storageBucket: 'replace-me',
  messagingSenderId: 'replace-me',
  appId: 'replace-me'
}
```

firebasen sääntöjen tulisi sisältää tämä:

```
    match /users/{userId}/{yearMonth_expenses}/{expenseId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
    match /users/{userId}/{yearMonth_incomes}/{expenseId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
    match /users/{userId}/staticUserIncomes/{incomeId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
    match /users/{userId}/staticUserExpenses/{incomeId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
```

## app structure

appis toimii näin:

### App.js

Elä koske, tekee just mitä sen pitää, eli lataa vaan perus navigaation, kaikki eri screenit ja muut tapahtuu `./navigation/MainNavigator.js` ja `./navigation/AuthNavigator.js` -tiedostoissa.

### /navigation

`MainNavigator.js` hoitaa sovelluksen peruskäytön, se lataa alanavigaatiopalkin, ja sitä kautta jokaisen eri näytön kansiosta `screens/`

`AuthNavigator.js` on perus login näyttö / sen latausnäyttö. Tämä lataa tiedoston `screens/Login.js`, joka sisältää login-näytön, usko tai älä.

### /screens

`Login.js` on perus login näyttö

`Etusivu.js` on etusivu... tällä hetkellä tyhjää täynnä.

Seuraavat kaksi asiaa on vain testaukseen ja devaukseen tarkotettuja sivuja, ei tule olemaan lopputuotteessa.

`DevelopDBAccess.js` on sivu, jossa pystyy lisäilemään tulojen ja menojen lähteitä käyttäjälle

`DevelopDBRead.js` on sivu, jossa voi selata ja poistaa käyttäjän tietokannassa olevia tietoja.

### languages

Tämä kansio sisältää lokalisaatiotiedostot, sinne voi lisätä omia lokalisaatioita, tai vaihtaa olemassaolevia käännöksiä.

### context

`AuthContext.js` hoitaa Firebasen käyttäjäautentikoinnin, älä koske.

### theme

`Theme.js` on yleinen teematiedosto, sisältää yhden stylesheetin jossa on jokainen mahdollinen asia sisällä, paitsi värit.

`Colours.js` on yleinen väritiedosto, todella moni asia referoi tähän, ja täällä on siis sovelluksen kaikki värit.

### assets

Tämä kansio sisältää kaiken median applikaatiolle. Tänne appiksen logo sun muut sellaiset graffat.
