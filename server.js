require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const URL = process.env.URL;


const DB_NAME = process.env.DB_NAME; // Имя базы данных
const COLLECTION_NAME = process.env.COLLECTION_NAME; // Имя коллекции

// Подключение к базе данных
let db;
app.use(cors());


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://euricalex.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

MongoClient.connect(URL)
  .then((client) => {
    console.log('Connected to MongoDB');
    db = client.db(DB_NAME);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Маршрут для получения данных
app.get('/medicinies', (req, res) => {
  const pharmacy = req.query.pharmacy;
  const sortOrder = req.query.sortOrder || 'asc';
  // Проверка наличия подключения к базе данных
  if (!db) {
    return res.status(500).json({ error: 'Database connection error' });
  }

  const sortDirection = sortOrder === 'asc' ? 1 : -1;

  // Запрос к коллекции для получения данных
  db.collection(COLLECTION_NAME)
    .find({pharmacy})
    .sort({price: sortDirection})
    .toArray()
    .then((medicinies) => {
      res.status(200).json(medicinies);
    })
    .catch((err) => {
      console.error('Error fetching medicinies:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Слушаем порт 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





// const express = require('express');
// const { MongoClient } = require('mongodb');

// const app = express();
// const PORT = 3000;
// const URL = 'mongodb://localhost:27017'; // URL для подключения к MongoDB
// const DB_NAME = 'medicine_app'; // Имя базы данных
// const COLLECTION_NAME = 'medicinies'; // Имя коллекции

// // Подключение к базе данных
// let db;

// MongoClient.connect(URL, { useUnifiedTopology: true })
//   .then((client) => {
//     console.log('Connected to MongoDB');
//     db = client.db(DB_NAME);
//   })
//   .catch((err) => {
//     console.error('Error connecting to MongoDB:', err);
//   });

// // Маршрут для получения данных
// app.get('/medicinies', (req, res) => {
//   // Проверка наличия подключения к базе данных
//   if (!db) {
//     return res.status(500).json({ error: 'Database connection error' });
//   }

//   // Запрос к коллекции для получения данных
//   db.collection(COLLECTION_NAME)
//     .find()
//     .toArray()
//     .then((medicinies) => {
//       res.status(200).json(medicinies);
//     })
//     .catch((err) => {
//       console.error('Error fetching medicinies:', err);
//       res.status(500).json({ error: 'Internal server error' });
//     });
// });

// // Слушаем порт 3000
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
