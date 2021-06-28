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
  player.input = playerInfo.input
  player.team = playerInfo.team
  game.players.add(player)
}

//removes a player form the game
function removePlayer(game, playerId) {
  game.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      player.destroy()
    }
  })
}

//create a ball
function createNewBall(game, physicsGroup, info, speed, drag){
  let ball = game.add.circle(info.x, info.y, info.r, 0xffff00)
  physicsGroup.add(ball)
  ball.speed = speed
  ball.body.setDrag(drag)
  ball.body.setAngularDrag(drag)
  return ball
}

//create a new goal
function createNewGoal(game, physicsGroup, info){
  let goal = game.add.rectangle(info.x, info.y, 20, 100, 0xffffff)
  physicsGroup.add(goal)
  goal.score = 0
  return goal
}