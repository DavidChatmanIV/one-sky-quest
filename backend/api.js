const express = require('express');
const app = express();
const port = 3000;

const airports = require('./airports.json'); // static list

app.get('/api/airports', (req, res) => {
    const query = req.query.q?.toLowerCase();
    const filteredAirports = airports.filter(airports =>
        airports.name.toLowerCase().includes(query) ||
        airports.code.toLowerCase().includes(query)
    );
    res.json(filteredAirports)
});

app.listen(port, () => {
    console.log(`Server running at http:/localhost:${port}`);
});