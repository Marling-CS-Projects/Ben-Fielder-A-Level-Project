//create platforms
export function createNewPlatforms(game, group, platformData, scale){
  let newPlatform;
  for(let i = 0; i < platformData.length; i++){
    newPlatform = game.add.rectangle(platformData[i].x*scale, platformData[i].y*scale, platformData[i].w*scale, platformData[i].h*scale, 0x00ff00)
    group.add(newPlatform)
  }
}

//create the highscore text for the star collector minigame
export function createHighScoreText(game, group, info, count, scale){
  for(let i = 0; i < count; i++){
    group.add(game.add.text(info.x*scale, info.y+i*20*scale, "", {font: "16px Arial", fill: "#ff0000"}))
  }
}

//create a new player
export function createNewPlayer(game, group, playerInfo, scale){
  let player
  //if the player has a team attached to it, attach it to this new player as well
  if(playerInfo.team){
    if(playerInfo.team === "red"){
      //red team players are displayed as red
      player = game.add.rectangle(playerInfo.x*scale, playerInfo.y*scale, 50*scale, 50*scale, 0xff0000)
    }
    else{
      //blue team players are displayed as blue
      player = game.add.rectangle(playerInfo.x*scale, playerInfo.y*scale, 50*scale, 50*scale, 0x0000ff)
    }
    player.team = playerInfo.team
  }
  else{
    //default player colour is red
    player = game.add.rectangle(playerInfo.x*scale, playerInfo.y*scale, 50*scale, 50*scale, 0xff0000)
  }
  player.playerId = playerInfo.playerId
  player.score = playerInfo.score
  player.name = playerInfo.name
  if(player.playerId === game.socket.id){
    game.player = player
    game.cameras.main.startFollow(player)
  }
  group.add(player)
}

//create a goal for the football minigame.
export function createNewGoal(game, group, info, scale){
  let goal = game.add.rectangle(info.x*scale, info.y*scale, 20*scale, 100*scale, 0xffffff)
  group.add(goal)
  return goal
}