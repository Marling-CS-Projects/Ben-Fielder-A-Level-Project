//called every frame to move the player in response to key presses
export function handleUserInput(game){
  if(game.left.isDown){
    game.player1.body.setVelocityX(-100)
  }
  else if(game.right.isDown){
    game.player1.body.setVelocityX(100)
  }
  else{
    game.player1.body.setVelocityX(0)
  }
  if(game.up.isDown && game.player1.body.touching.down){
    game.player1.body.setVelocityY(-300)
  }
}