const http = require('http');
const express = require('express');
const cors = require('cors');
const colyseus = require('colyseus');
const ScoreBoardRoom = require('./scoreBoardRoom').ScoreBoardRoom;

const port = process.env.PORT || 2567;
const app = express()

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const gameServer = new colyseus.Server({
    server: server,
});

// register your room handlers
gameServer.define('scoreBoard_room', ScoreBoardRoom);

gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`)