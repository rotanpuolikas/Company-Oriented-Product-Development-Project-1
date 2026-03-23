# mobile app structure

mobiiliappis toimii näin:

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

### context

`AuthContext.js` hoitaa autentikoinnin, älä koske. Tämä toimii. Jos päätetään käyttää laitteen paikallista storagea, tai lisätä käyttäjälle loginissa tärkeitä parametrejä niin sitten ne lisätään tänne. Muutoin tämä on fine-as-is.

### theme

`Theme.js` on yleinen teematiedosto, sisältää yhden stylesheetin jossa on jokainen mahdollinen asia sisällä, paitsi värit.

`Colours.js` on yleinen väritiedosto, todella moni asia referoi tähän, ja täällä on siis sovelluksen kaikki värit.

### assets

Tämä kansio sisältää kaiken median applikaatiolle. Tänne appiksen logo sun muut sellaiset graffat kunhan niitä tullee tehdyksi.
