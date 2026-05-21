const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'database',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'sterk_wachtwoord',
  database: process.env.DB_NAME || 'app_db',
  waitForConnections: true,
  connectionLimit: 10
});

app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({
      status: 'ok',
      database: rows[0].ok === 1
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

app.post('/api/accounts', async (req, res) => {
  try {
    const { voornaam, achternaam, email, wachtwoord } = req.body;

    if (!voornaam || !achternaam || !email || !wachtwoord) {
      return res.status(400).json({
        message: 'Vul alle velden in'
      });
    }

    const [existing] = await pool.query(
      'SELECT id FROM accounts WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: 'Dit e-mailadres bestaat al'
      });
    }

    await pool.query(
      'INSERT INTO accounts (voornaam, achternaam, email, wachtwoord) VALUES (?, ?, ?, ?)',
      [voornaam, achternaam, email, wachtwoord]
    );

    res.status(201).json({
      message: 'Account succesvol aangemaakt'
    });
  } catch (error) {
    console.error('signup error:', error.message);
    res.status(500).json({
      message: 'Er ging iets mis op de server'
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, wachtwoord } = req.body;

    if (!email || !wachtwoord) {
      return res.status(400).json({
        message: 'Vul e-mail en wachtwoord in'
      });
    }

    const [rows] = await pool.query(
      'SELECT * FROM accounts WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Gebruiker niet gevonden'
      });
    }

    if (rows[0].wachtwoord !== wachtwoord) {
      return res.status(401).json({
        message: 'Verkeerd wachtwoord'
      });
    }

    res.json({
      message: 'Login gelukt'
    });
  } catch (error) {
    console.error('login error:', error.message);
    res.status(500).json({
      message: 'Er ging iets mis op de server'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend draait op poort ${PORT}`);
});