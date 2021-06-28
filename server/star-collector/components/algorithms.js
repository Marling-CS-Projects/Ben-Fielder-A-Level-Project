/* eslint-disable no-unused-vars */

//a bubble sort algorithm to sort the scores from the game
function bubbleSortScores(game, players){
    let scores = []
    game.players.getChildren().forEach((player) => {
        scores.push({score: players[player.playerId].score, name: players[player.playerId].name})
    });
    for(let top = scores.length - 1; top >= 0; top--){
        let swap = false
        for(let current = 0; current < top; current++){
            if(scores[current].score > scores[current + 1].score){
                let placeHolder
                placeHolder = scores[current]
                scores[current] = scores[current + 1]
                scores[current + 1] = placeHolder
                swap = true
            }
        }
        if(!swap){
            break
        }
    }
    game.soretedScores = scores
}