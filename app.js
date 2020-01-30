const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const colyseus = require('colyseus');
const ScoreBoardRoom = require('./scoreBoardRoom');

const port = process.env.PORT || 2567;
const app = express()

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const gameServer = new colyseus.Server({
    server: server,
});

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

gameServer.define('scoreBoard_room', ScoreBoardRoom);

gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`)