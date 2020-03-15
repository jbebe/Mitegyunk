# Mit együnk?

Egy web app, ami lehetővé teszi, hogy belépés után kedvenc éttermeidre voksolhass, lásd mire szavaztak mások, illetve eredményt kapj arról, hogy adott válaszok esetén hova mehettek enni.

## Milestones

### ✅ Működő MVP
* Tudsz választani éttermeket
* Láthatod, hogy másik mit választottak
* Tudsz törölni választ
* Látható, hogy aktuális állás szerint hova mehettek

### ⏳ "Technológiai ugrás"
* frontend: Redux használata a global state leküldése helyett
* backend + frontend: websocket a polling elkerülése érdekében
  * De csak event-ök menjenek websocket-en, ne terhelődjön feleslegesen
  * Szerencsére az express.js tud egy porton egyszerre websocket és http protokollt indítani ;)

### ⏳ Facelift
* A UI mobil baráttá tétele
* Gombok, mezők szépítése, tipográfia, animációk

### ⏳ DB 2.0
* A json file csak mock-db-ként volt életképes ötlet
* Helyette valami gyors db kell, ami bár perzisztál, de nem külön fut. Ötletek: LokiJS, redis, mongodb, sqlite

### ⏳ Stats
* Statisztikák bevezetése az előző szavazásokról, mind személyes, mind globális szinten

## Jelenlegi UI

![alt text](https://i.imgur.com/EjdLpkM.jpg "Logo Title Text 1")
