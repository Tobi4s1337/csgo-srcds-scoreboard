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



function updateState(state) {
    function getIndexOfPlayer(id) {
        return state.scoreboard.players.findIndex((obj => obj.player.PlayerID == id));
    }

    function removeDisconnectedPlayers() {
        state.scoreboard.players = state.scoreboard.players.filter(player => player.online !== 'false');
    }

    function resetScore() {
        state.scoreboard.roundHistory = [];
        state.scoreboard.ctScore = 0;
        state.scoreboard.tScore = 0;
        if (state.scoreboard.players) {
            state.scoreboard.players.forEach(player => {
                player.kills = 0;
                player.assists = 0;
                player.deaths = 0;
            })
        }

    }

    function resetHP() {
        state.scoreboard.players.forEach(player => {
            player.hp = 100;
        })
    }
    receiver.on("data", function (data) {
        if (data.isValid) {
            let event = parser.parseLine(data.message)
            if (event.Type === "ServerEvent") {
                //console.log("Server event")
            } else if (event.Type === "Switched") {
                // if no id for the player exists yet, we need to add him first
                if (state.scoreboard.players.findIndex((obj => obj.player.PlayerID == event.Player.PlayerID)) === -1) {
                    if (event.ToTeam == 0) {
                        state.scoreboard.players.push({ player: event.Player, team: 0, kills: 0, assists: 0, deaths: 0, hp: 100, online: true })
                    } else if (event.ToTeam == 1) {
                        state.scoreboard.players.push({ player: event.Player, team: 1, kills: 0, assists: 0, deaths: 0, hp: 100, online: true })
                    }
                } else if (event.ToTeam == 2) {
                    // ToTeam 2 means that they are either a spectator or offline now
                    if (event.FromTeam == 0) {
                        const playerIndex = getIndexOfPlayer(event.Player.PlayerID);
                        state.scoreboard.players[playerIndex].online = false;
                    } else {
                        const playerIndex = getIndexOfPlayer(event.Player.PlayerID);
                        state.scoreboard.players[playerIndex].online = false;
                    }
                } else if (event.ToTeam == 0) {
                    const playerIndex = getIndexOfPlayer(event.Player.PlayerID);
                    state.scoreboard.players[playerIndex].team = 0;
                } else if (event.ToTeam == 1) {
                    const playerIndex = getIndexOfPlayer(event.Player.PlayerID);
                    state.scoreboard.players[playerIndex].team = 1;
                }
            } else if (event.Type === "PlayerName") {
                const playerIndex = getIndexOfPlayer(event.Player.PlayerID);
                state.scoreboard.players[playerIndex].player.Name = event.NewName;
            } else if (event.Type === "Scored") {
                //console.log("Scored event")
            } else if (event.Type === "TeamTriggered") {
                if (event.EventType == 1) {
                    console.log("Terrorists win");
                    state.scoreboard.tScore += 1;
                    state.scoreboard.roundHistory.push("tWin")
                } else if (event.EventType == 2) {
                    state.scoreboard.ctScore += 1;
                    state.scoreboard.roundHistory.push("ctWin")
                } else if (event.EventType == 3) {
                    state.scoreboard.tScore += 1;
                    state.scoreboard.roundHistory.push("bombExploded")
                } else if (event.EventType == 4) {
                    state.scoreboard.ctScore += 1;
                    state.scoreboard.roundHistory.push("ctWinTimeOver")
                } else if (event.EventType == 5) {
                    state.scoreboard.ctScore += 1;
                    state.scoreboard.roundHistory.push("bombDefused")
                }
            } else if (event.Type === "Killed") {
                const attackerIndex = getIndexOfPlayer(event.AttackingPlayer.PlayerID);
                const victimIndex = getIndexOfPlayer(event.VictimPlayer.PlayerID);
                if (event.AttackingPlayer.Team === event.VictimPlayer.Team) {
                    state.scoreboard.players[attackerIndex].kills -= 1;
                } else {
                    state.scoreboard.players[attackerIndex].kills += 1;
                }
                state.scoreboard.players[victimIndex].deaths += 1;
                state.scoreboard.players[victimIndex].hp = 0;
            } else if (event.Type === "Assist") {
                const assitantIndex = getIndexOfPlayer(event.Assistant.PlayerID);
                if (event.Assistant.Team === event.Victim.Team) {
                    // does not count
                } else {
                    state.scoreboard.players[assitantIndex].assists += 1;
                }
            } else if (event.Type === "Attacked") {
                const victimIndex = getIndexOfPlayer(event.VictimPlayer.PlayerID);
                state.scoreboard.players[victimIndex].hp = event.RemainingHealth;
            } else if (event.Type === "PlayerTriggered") {
                //console.log("Player triggered event")
                if (event.EventType == 9) {
                    resetScore();
                    removeDisconnectedPlayers()
                } else if (event.EventType == 8) {
                    //console.log("Round start")
                    //console.log(data.message)
                } else if (event.EventType == 7) {
                    //console.log("Game commencing")
                    //console.log(data.message)
                } else if (event.EventType == 4) {
                    // Round over
                    resetHP();
                }
            }
        }
    });

    receiver.on("invalid", function (invalidMessage) {
        console.log("Got some completely unparseable garbage: " + invalidMessage);
    })
}

module.exports = updateState;

