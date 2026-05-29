const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Plik do przechowywania danych
const DB_FILE = './db.json';

// Funkcje do odczytu/zapisu
async function loadData() {
    try {
        return await fs.readJson(DB_FILE);
    } catch {
        return [];
    }
}

async function saveData(data) {
    await fs.writeJson(DB_FILE, data);
}

// Endpointy API
app.get('/items', async (req, res) => {
    const items = await loadData();
    res.json(items);
});

app.post('/items', async (req, res) => {
    const items = await loadData();
    items.push(req.body);
    await saveData(items);
    res.json({ message: 'dodano' });
});

app.put('/items/:id', async (req, res) => {
    const items = await loadData();
    const updated = items.map(item =>
        item.id == req.params.id ? req.body : item
    );
    await saveData(updated);
    res.json({ message: 'zaktualizowano' });
});

app.delete('/items/:id', async (req, res) => {
    const items = await loadData();
    const filtered = items.filter(item => item.id != req.params.id);
    await saveData(filtered);
    res.json({ message: 'usunieto' });
});

app.post('/sync', async (req, res) => {
    await saveData(req.body);
    res.json({ message: 'sync ok' });
});

// PORT z zmiennej środowiskowej (Railway ustawi swoją)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server działa na porcie ${PORT}`);
});