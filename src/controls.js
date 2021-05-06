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
   
  if(game.keyA.isDown){
    game.player2.body.setVelocityX(-100)
  }
  else if(game.keyD.isDown){
    game.player2.body.setVelocityX(100)
  }
  else{
    game.player2.body.setVelocityX(0)
  }
  if(game.keyW.isDown && game.player2.body.touching.down){
    game.player2.body.setVelocityY(-300)
  }
}