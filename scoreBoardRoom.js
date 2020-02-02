const colyseus = require('colyseus');
const srcdsHandler = require('./srcdsHandler');


let ScoreboardRoom = class ScoreboardRoom extends colyseus.Room {

    onCreate(options) {
        this.setState({
            scoreboard: {
                players: [],
                roundHistory: [],
                ctScore: 0,
                tScore: 0,
                log: []
            }
        });
        srcdsHandler(this.state);
    }


    onJoin(client) {
        this.broadcast(`${client.sessionId} joined.`);
    }

    onLeave(client) {
        this.broadcast(`${client.sessionId} left.`);
        console.log('User left');
    }

    onMessage(client, data) {
        console.log('BasicRoom received message from', client.sessionId, ':', data);
    }

    onDispose() {
        //	console.log('Dispose BasicRoom');
    }
};


module.exports = ScoreboardRoom;

