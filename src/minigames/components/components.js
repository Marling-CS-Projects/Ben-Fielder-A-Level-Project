//create platforms
export function createNewPlatforms(game, group, platformData){
    let newPlatform;
    for(let i = 0; i < platformData.length; i++){
      newPlatform = game.add.rectangle(platformData[i].x, platformData[i].y, platformData[i].w, platformData[i].h, 0x00ff00)
      group.add(newPlatform)
    }
}

//create the highscore text
export function createHighScoreText(game, group, info, count){
    for(let i = 0; i < count; i++){
        group.add(game.add.text(info.x, info.y+i*20, "", {font: "16px Arial", fill: "#ff0000"}))
    }
}

//create a new player
export function createNewPlayer(game, group, playerInfo){
    let player = game.add.rectangle(playerInfo.x, playerInfo.y, 50, 50, 0xff0000)
    player.playerId = playerInfo.playerId
    player.score = playerInfo.score
    player.name = playerInfo.name
    if(player.playerId === game.socket.id){
      game.player = player
      game.cameras.main.startFollow(player)
    }
    group.add(player)
}