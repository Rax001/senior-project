const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Connect to DB
const db = new sqlite3.Database('../src/diet.db', (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Connected to the SQLite database.');
});

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
}) 

app.get('/dietLog/singleDay/:date', (req, res) => {
    const date = req.params.date;
    const query = `
        SELECT * FROM diet
        WHERE date = ?
        ORDER BY id DESC`;

    db.all(query, [date], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(rows);
    })
})

// GET entire dietLog
app.get('/dietLog', (req, res) => {
    const query = `
        SELECT * FROM diet
        ORDER BY id DESC`;

    db.all(query, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(rows);
    });
});

// get date range
app.get('/:date', (req, res) => {
    const date = req.params.date;
    const currentDate = new Date().toLocaleDateString('en-CA');
    console.log('date is:', date);
    const query = `
        SELECT * from diet
        WHERE date BETWEEN ? AND ?
        ORDER BY id DESC`;

    db.all(query, [date, currentDate], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(rows);
    })
})

// GET day totals
app.get('/dietLog/dayTotals', (req, res) => {
    // const currentDate = new Date().toISOString().slice(0,10);
    const currentDate = new Date().toLocaleDateString('en-CA');
    // console.log('current Date:', currentDate);

    const query = `
        SELECT SUM(calories) AS Calories, 
            SUM(carbohydrates) AS Carbs, 
            SUM(fats) AS Fats, 
            SUM(proteins) AS Proteins, 
            date 
        FROM diet
        WHERE date = ? 
        GROUP BY date`;

    // console.log('Executing query:', query);

    db.all(query, [currentDate], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        // console.log("Rows returned:", rows);
        res.json(rows);
    })
})

app.post('/dietLog', (req,res) => {
    const {name, quantity, unit, calories, carbohydrates, fats, proteins, date} = req.body;

    const query = `
    INSERT INTO diet (name, quantity, unit, calories, carbohydrates, fats, proteins, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [name, quantity, unit, calories, carbohydrates, fats, proteins, date], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
            return;
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.status(201).send('Data inserted successfully');
    })
})

app.listen(PORT, () => {
    console.log(`Server running at: http://127.0.0.1:${PORT}`);
});

