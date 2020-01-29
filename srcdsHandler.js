/*
State:
Score
Round
Past rounds (defuste / eliminated / time / bomb)
Map
Bomb planted
Time left
Player:
- Name
- connected
- alive
- kills
- assists
- deaths
- team

Events:
- match started (need to reset stats)
- round started
- scored
- bomb planted
- bomb defused
- connect
- disconnect
- kill / killed
*/

const logReceiver = require("srcds-log-receiver");
const SrcdsLogParser = require("better-srcds-log-parser").SrcdsLogParser;
const parser = new SrcdsLogParser();
const receiver = new logReceiver.LogReceiver();

receiver.on("data", function (data) {
    if (data.isValid) {
        let event = parser.parseLine(data.message)
        console.log(event.Type);
    }
});

receiver.on("invalid", function (invalidMessage) {
    console.log("Got some completely unparseable garbage: " + invalidMessage);
})

function updateState(state) {
    console.log(state);
    state.scoreboard = {
        hahahahaha: "adada"
    }
}

module.exports = updateState;