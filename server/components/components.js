/* eslint-disable no-unused-vars */

//creates the platforms
function createNewPlatforms(game, physicsGroup, platformData){
    let newPlatform;
    for(let i = 0; i < platformData.length; i++){
      newPlatform = game.add.rectangle(platformData[i].x, platformData[i].y, platformData[i].w, platformData[i].h, 0x00ff00)
      physicsGroup.add(newPlatform)
    }
}

//creates a new player
function addPlayer(game, playerInfo) {
    let player = game.add.rectangle(playerInfo.x, playerInfo.y, 50, 50, 0xff0000)
    player.playerId = playerInfo.playerId;
    game.players.add(player);
}

//removes a player form the game
function removePlayer(game, playerId) {
    game.players.getChildren().forEach((player) => {
      if (playerId === player.playerId) {
        player.destroy();
      }
    });
}