const colyseus = require('colyseus');
const srcdsHandler = require('./srcdsHandler');

exports.ScoreBoardRoom = class extends colyseus.Room {
    onCreate(options) {
        this.setState({ scoreboard: {} })
        srcdsHandler(this.state);
    }

    onJoin(client, options) {
    }

    onMessage(client, message) {
    }

    onLeave(client, consented) {
    }

    onDispose() {
    }

}