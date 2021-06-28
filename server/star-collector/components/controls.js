/* eslint-disable no-unused-vars */

//sets the player's input values. (called after the player input event is triggered)
function handlePlayerInput(game, players, playerId, input) {
    game.players.getChildren().forEach((player) => {
        if (playerId === player.playerId) {
            players[player.playerId].input = input;
        }
    });
}

//set the current velocity that each player should be moving at.
function updatePlayerVelocity(game, players){
    game.players.getChildren().forEach((player) => {
        let input = players[player.playerId].input
        if(input.left){
            player.body.setVelocityX(-100)
        }
        else if(input.right){
            player.body.setVelocityX(100)
        }
        else{
            player.body.setVelocityX(0)
        }
    
        if(input.up && player.body.touching.down){
            player.body.setVelocityY(-300)
        }
    
        players[player.playerId].x = player.x
        players[player.playerId].y = player.y
    })
}