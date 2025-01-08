
---

# Setting Up an Express.js Project

## 1. Create an Express.js Project in intellij

```bash
File -> new Project -> Express
```

### Install TypeScript and related tools:

```bash
npm install --save-dev typescript ts-node nodemon @types/node
```

### Generate `tsconfig.json`:

Run the command:

```bash
npx tsc --init
tsc --watch
```

### Install additional dependencies:

```bash
npm install --save-dev nodemon
```

### Ensure the `scripts` section in `package.json` contains a `dev` script:

```json
"scripts": {
"start": "node bin/www",
"build": "tsc",
"dev": "nodemon bin/www"
}
```

## Run the Server

### Development Mode:

Run the following command to start the server with live reloading:

#### Using `start`:

```bash
npm run start
```

This will run the `start` script (`"start": "node bin/www"`).

#### Using `nodemon` for development:

```bash
npm run dev
```

This will run the `dev` script (`"dev": "nodemon bin/www"`).

---

# Setting Up an Express.js Project with an empty Project and TypeScript

## 1. Create an empty intellij project and give it a name (tennisplayers, footballplayers etc.)

```bash
File -> new Project
```

## 2. Initialize a `package.json`

Open the terminal in IntelliJ and run:

```bash
npm init -y
```

This initializes the project with default settings.

---

## 3. Install Required Dependencies

### Install Express and its TypeScript types:

```bash
npm install express
npm install --save-dev @types/express
```

### Install TypeScript and related tools:

```bash
npm install --save-dev typescript ts-node nodemon @types/node
```

### Install `dotenv` for managing environment variables (optional but recommended):

```bash
npm install dotenv
```

---

## 4. Configure TypeScript

### Generate `tsconfig.json`:

Run the command:

```bash
npx tsc --init
```

---

## 5. Express Application Generator

### Use the application generator tool, `express-generator`, to quickly create an application skeleton:

Run the following command:

```bash
npx express-generator
```

### Install additional dependencies:

```bash
npm install --save-dev nodemon
```

### Ensure the `scripts` section in `package.json` contains a `dev` script:

```json
"scripts": {
"start": "node bin/www",
"build": "tsc",
"dev": "nodemon bin/www"
}
```

### Install all dependencies:

```bash
npm install
```

### Install Node.js types (if not already installed):

```bash
npm i --save-dev @types/node
```

---

## 6. Run the Server

### Development Mode:

Run the following command to start the server with live reloading:

#### Using `start`:

```bash
npm run start
```

This will run the `start` script (`"start": "node bin/www"`).

#### Using `nodemon` for development:

```bash
npm run dev
```

This will run the `dev` script (`"dev": "nodemon bin/www"`).

---

## 7. Try the users preconfigured users url

```bash
http://localhost:3000/users/
```

## 8. Add todoitems to routes and configure route in app.js

use Postman and curl to get check the express.js application.

https://curl.se/windows/

```bash
curl http://localhost:3000/users/
curl -i http://localhost:3000/users/
```

## 9. Add todoitem to routes and configure route in app.js

```bash
var todoitemRouter = require('./routes/todoitem');
app.use('/todoitem', todoitemRouter);
```

## 10. curl calls for different methods

#### GET requests

```bash
curl -X GET http://localhost:3000/todoitem/
curl -i -X GET http://localhost:3000/todoitem/
curl -i -X GET http://localhost:3000/todoitem/all
curl -X GET "http://localhost:3000/todoitem/?completed=true"
```

#### GET requests:id

```bash
curl -X GET http://localhost:3000/todoitem/1
curl -X GET http://localhost:3000/todoitem/2
curl -X GET http://localhost:3000/todoitem/677bc8a130db5be8fdc5fe6a
curl -i -X GET http://localhost:3000/todoitem/677bc8a130db5be8fdc5fe6a
```

#### GET requests - Filter todoitems by title, category, completed, priority

```bash
curl -X GET "http://localhost:3000/todoitem/filter?title=Complete%20the%20project"
curl -X GET "http://localhost:3000/todoitem/filter?category=private"
curl -X GET "http://localhost:3000/todoitem/filter?completed=true"
curl -X GET "http://localhost:3000/todoitem/filter?completed=false"
curl -X GET "http://localhost:3000/todoitem/filter?priority=low"
```

#### GET requests - sort

```bash
curl -X GET "http://localhost:3000/todoitem/sort?sortBy=title"
curl -X GET "http://localhost:3000/todoitem/sortwithorder?sortBy=priority&order=asc"
curl -X GET "http://localhost:3000/todoitem/sortwithorder?sortBy=priority&order=desc"
```

#### GET requests - pagination

```bash
curl -X GET "http://localhost:3000/todoitem/pagination?page=1&limit=5"
curl -X GET "http://localhost:3000/todoitem/pagination?page=2&limit=5"
```

#### GET requests - Group by

```bash
curl -X GET http://localhost:3000/todoitem/groupbycategory
```

#### Head requests

```bash
curl -i HEAD http://localhost:3000/todoitem/677b93d442ee6db006daffa6
```

#### Option requests

```bash
curl -i -X OPTIONS http://localhost:3000/todoitem/
```

#### POST Request

Add a new to do item

```bash
curl -X POST "http://localhost:3000/todoitem/" -H "Content-Type: application/json" -d "{\"id\": 1, \"title\": \"Complete the first project\", \"description\": \"Finish the pending tasks.\", \"completed\": false, \"date\": \"2025-01-01T10:00:00Z\", \"categories\": [\"Work\", \"Urgent\"], \"priority\": \"High\", \"dueTime\": \"17:00\", \"tags\": [\"project\", \"work\"], \"assignedTo\": \"John Doe\", \"subtasks\": [{\"title\": \"Set up environment\", \"completed\": true}, {\"title\": \"Write code\", \"completed\": false}], \"progress\": 50, \"status\": \"In Progress\"}"
```

#### PUT Request

Update an existing todoitem with ID (e.g., ID 1):
```bash
curl -X PUT http://localhost:3000/todoitem/1 \
-H "Content-Type: application/json" \
-d '{
    "title": "Updated project title",
    "priority": "Medium",
    "completed": true
}'

curl -X PUT http://localhost:3000/todoitem/1 -H "Content-Type: application/json" -d "{\"title\": \"Updated project title\", \"priority\": \"Medium\", \"completed\": true}"
```

#### PATCH Request

Partially update todo list information by ID (e.g., ID 1):
```bash
curl -X PATCH http://localhost:3000/todoitem/1 \
-H "Content-Type: application/json" \
-d '{
    "priority": "Medium",
    "completed": true
}'

curl -X PATCH http://localhost:3000/todoitem/1 -H "Content-Type: application/json" -d "{\"priority\": \"High\", \"completed\": false}"
```

#### DELETE Request

Delete a todoitem ID (e.g., ID 1):
```bash
curl -X DELETE http://localhost:3000/todoitem/ \
-H "Content-Type: application/json" \
-d '{
    "id": 1
}'

curl -X DELETE http://localhost:3000/todoitem/ -H "Content-Type: application/json" -d "{\"id\": 1}"
```

#### Import mongodb documents

```bash
cd "C:\Users\masch\react\to-do-lists\to-do-list-backend\to-do-list-backend\res\"
mongoimport --uri "mongodb://localhost:27017" --db test --collection todoitems --file todoitems.json --jsonArray --drop
```

### Backup mongodb documents

```bash
mongodump --uri "mongodb://localhost:27017" --db test --collection todoitems
```

### Delete mongodb collection

Um eine MongoDB-Collection zu löschen, kannst du den Befehl **`db.collection.drop()`** verwenden. Dieser Befehl entfernt die gesamte Collection aus der Datenbank, einschließlich aller darin enthaltenen Dokumente und Metadaten.

---

### **Schritte zum Löschen einer Collection**

#### 1. **Mit der MongoDB-Shell verbinden**
Verbinde dich mit der MongoDB-Shell:
```bash
mongo
```

#### 2. **In die richtige Datenbank wechseln**
Wechsle zu der Datenbank, die die zu löschende Collection enthält:
```javascript
use <database_name>
```
Beispiel:
```javascript
use test
```

#### 3. **Collection löschen**
Führe den folgenden Befehl aus, um die Collection zu löschen:
```javascript
db.<collection_name>.drop()
```
Beispiel:
```javascript
db.todoitems.drop()
```

#### 4. **Bestätigung der Löschung**
Wenn die Collection erfolgreich gelöscht wurde, gibt der Befehl folgendes zurück:
```javascript
true
```

Wenn die Collection nicht existiert, wird folgendes zurückgegeben:
```javascript
false
```

---

### **Überprüfung nach der Löschung**
Um sicherzustellen, dass die Collection gelöscht wurde, kannst du eine Liste aller verbleibenden Collections anzeigen:
```javascript
show collections
```

---

### **Collection löschen mit einem Skript**
Wenn du die Löschung in einem Node.js-Skript ausführen möchtest, kannst du den MongoDB-Treiber verwenden:

#### **Beispielskript:**
```javascript
const { MongoClient } = require("mongodb");

async function deleteCollection() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("test");
        const result = await database.collection("todoitems").drop();
        console.log("Collection deleted:", result);
    } catch (error) {
        console.error("Error deleting collection:", error);
    } finally {
        await client.close();
    }
}

deleteCollection();
```

---

### **Vorsicht**
- **Keine Wiederherstellung:** Sobald eine Collection gelöscht wurde, können die darin enthaltenen Daten nicht mehr wiederhergestellt werden (es sei denn, du hast vorher ein Backup erstellt).
- **Alternative Methode (nur leeren):** Wenn du die Collection nicht löschen, sondern nur alle Dokumente entfernen möchtest, kannst du stattdessen `db.collection.deleteMany({})` verwenden:
  ```javascript
  db.todoitems.deleteMany({})
  ```
  Dies löscht nur die Dokumente, lässt jedoch die Collection und deren Schema (Indexe etc.) bestehen.

---

Hier ist eine Übersicht der wichtigsten MongoDB-Shell-Befehle, die dir bei der Arbeit mit MongoDB helfen können:

---

## **Grundlegende mongodb shell Befehle**

### Verbindung und Datenbankauswahl:
1. **Mit der MongoDB-Shell verbinden**:
   ```bash
   mongo
   ```
   (Alternativ für eine bestimmte Datenbank: `mongo <database_name>`)

2. **Datenbank wechseln**:
   ```javascript
   use <database_name>
   ```
   Beispiel:
   ```javascript
   use tasks
   ```

3. **Aktuelle Datenbank anzeigen**:
   ```javascript
   db
   ```

4. **Liste aller Datenbanken anzeigen**:
   ```javascript
   show dbs
   ```

---

## **Collection-Verwaltung**

1. **Liste aller Collections anzeigen**:
   ```javascript
   show collections
   ```

2. **Collection löschen**:
   ```javascript
   db.<collection_name>.drop()
   ```
   Beispiel:
   ```javascript
   db.todoitems.drop()
   ```

3. **Anzahl der Dokumente in einer Collection**:
   ```javascript
   db.todoitems.countDocuments()
   ```

---

## **CRUD-Befehle (Create, Read, Update, Delete)**

### Read:
1. **Alle Dokumente anzeigen**:
   ```javascript
   db.todoitems.find()
   ```

2. **Dokumente formatiert anzeigen**:
   ```javascript
   db.todoitems.find().pretty()
   ```

3. **Ein Dokument nach ID suchen**:
   ```javascript
   db.todoitems.findOne({ _id: ObjectId("YOUR_OBJECT_ID") })
   ```

4. **Dokumente mit Filtern anzeigen**:
   ```javascript
   db.todoitems.find({ age: { $gt: 25 } })
   ```
   (Filter: `gt` = größer als, `lt` = kleiner als, `eq` = gleich, etc.)

---

### Delete:
1. **Ein Dokument löschen**:
   ```javascript
   db.todoitems.deleteOne({ name: "John Doe" })
   ```

2. **Mehrere Dokumente löschen**:
   ```javascript
   db.todoitems.deleteMany({ age: { $lt: 30 } })
   ```

---

## **Datenbank-Verwaltung**

1. **Datenbank löschen**:
   ```javascript
   db.dropDatabase()
   ```

2. **Indexe anzeigen**:
   ```javascript
   db.todoitems.getIndexes()
   ```

3. **Index erstellen**:
   ```javascript
   db.todoitems.createIndex({ title: 1 }) // 1 = aufsteigend, -1 = absteigend
   ```

4. **Index löschen**:
   ```javascript
   db.todoitems.dropIndex({ name: 1 })
   ```


Indexes in MongoDB sind ein leistungsstarkes Tool, das die Abfragegeschwindigkeit in einer Datenbank erheblich verbessert. Sie funktionieren ähnlich wie ein Index in einem Buch: Statt alle Seiten durchzublättern, kannst du direkt zu der gewünschten Stelle springen.

Hier ist eine detaillierte Erklärung von Indexen in MongoDB:

---

## **Was sind Indexe in MongoDB?**

Ein **Index** ist eine spezielle Datenstruktur, die MongoDB verwendet, um die Suche nach Dokumenten in einer Collection effizienter zu gestalten.

Ohne Index muss MongoDB bei jeder Abfrage die gesamte Collection durchsuchen (sogenannter **Collection Scan**). Mit einem Index kann MongoDB die Daten gezielt suchen, was die Leistung erheblich verbessert, insbesondere bei großen Datenmengen.

---

## **Arten von Indexen in MongoDB**

### 1. **Standardindex**
- Jeder MongoDB-Collection wird automatisch ein **Index auf das `_id`-Feld** zugewiesen.
- Dieser Index stellt sicher, dass jedes Dokument eine eindeutige Identität hat.

### 2. **Einfacher Index**
- Ein Index auf ein einzelnes Feld.
- Beispiel: Ein Index auf das Feld `name` macht Abfragen wie `{ name: "John" }` schneller.

   ```javascript
   db.collection.createIndex({ name: 1 }) // 1 = aufsteigend
   ```

### 3. **Kombinierter Index (Compound Index)**
- Ein Index, der mehrere Felder umfasst.
- Nützlich, wenn du häufig Abfragen mit mehreren Bedingungen machst.

   ```javascript
   db.collection.createIndex({ name: 1, age: -1 }) // Erst nach `name`, dann nach `age` absteigend
   ```

### 4. **Textindex**
- Ermöglicht Volltextsuche in String-Feldern.
- Beispiel: Suche in einer Collection mit Textdaten.

   ```javascript
   db.collection.createIndex({ description: "text" })
   ```

### 5. **Eindeutiger Index (Unique Index)**
- Stellt sicher, dass ein Feld in der Collection eindeutige Werte hat.
- Beispiel: E-Mail-Adressen in einer Benutzertabelle.

   ```javascript
   db.collection.createIndex({ email: 1 }, { unique: true })
   ```

---

## **Vorteile von Indexen**

1. **Schnellere Abfragen**:
    - Indexe machen das Suchen und Sortieren von Daten schneller.

2. **Weniger Ressourcenverbrauch**:
    - Weniger CPU- und Speicherbedarf für Abfragen, da weniger Daten gescannt werden.

3. **Optimale Nutzung bei Sortierung**:
    - Abfragen mit `sort` können ebenfalls Indexe nutzen.

4. **Komplexe Abfragen effizient ausführen**:
    - Mit kombinierten und partiellen Indexen.

---

## **Nachteile von Indexen**

1. **Speicherverbrauch**:
    - Indexe verbrauchen zusätzlichen Speicherplatz.

2. **Langsamere Schreiboperationen**:
    - Jede Einfügung, Aktualisierung oder Löschung muss die Indexdaten aktualisieren.

3. **Nicht alle Abfragen profitieren**:
    - Wenn die Abfrage die Indexe nicht nutzt, gibt es keine Leistungssteigerung.

---

## **Indexe erstellen, anzeigen und löschen**

### **Index erstellen**
```javascript
db.collection.createIndex({ fieldName: 1 }) // 1 = aufsteigend, -1 = absteigend
```

### **Indexe anzeigen**
```javascript
db.collection.getIndexes()
```

### **Index löschen**
```javascript
db.collection.dropIndex({ fieldName: 1 })
```

### **Alle Indexe löschen**
```javascript
db.collection.dropIndexes()
```

---

## **Wie MongoDB Indexe verwendet: Query Planner**

MongoDB verwendet den **Query Planner**, um zu entscheiden, ob und welcher Index für eine Abfrage verwendet wird. Du kannst die Entscheidung mit dem `explain`-Befehl prüfen:

```javascript
db.collection.find({ name: "John" }).explain("executionStats")
```

Wichtige Felder:
- **totalDocsExamined**: Anzahl der gescannten Dokumente.
- **totalKeysExamined**: Anzahl der gescannten Indexeinträge.
- **executionTimeMillis**: Dauer der Abfrage.

---

## **Best Practices für Indexe**

1. **Analysiere häufige Abfragen**:
    - Indexiere Felder, die häufig in `find`, `sort`, `group`, oder `aggregate` verwendet werden.

2. **Minimiere unnötige Indexe**:
    - Zu viele Indexe verlangsamen Schreiboperationen.

---

## **Sortieren**

1**Daten sortieren**:
   ```javascript
    db.<collection_name>.find().sort({ age: -1 }) // Nach Alter absteigend sortieren 
    db.todoitems.find().sort({ title: -1 }) // Nach Alter absteigend sortieren
   ```
---

## **Backup und Wiederherstellung**

1. **Backup erstellen**:
   ```bash
   mongodump --db <database_name> --out <backup_directory>
   ```

2. **Backup wiederherstellen**:
   ```bash
   mongorestore --db <database_name> <backup_directory>/<database_name>
   ```