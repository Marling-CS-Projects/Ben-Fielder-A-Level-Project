export function handleUserInput(game, player1, player2, keys){
  if(keys[0].isDown){
    player1.body.setVelocityX(-100)
  }
  else if(keys[1].isDown){
    player1.body.setVelocityX(100)
  }
  else{
    player1.body.setVelocityX(0)
  }
  if(keys[2].isDown && player1.body.touching.down){
    player1.body.setVelocityY(-300)
  }
   
  if(keys[3].isDown){
    player2.body.setVelocityX(-100)
  }
  else if(keys[4].isDown){
    player2.body.setVelocityX(100)
  }
  else{
    player2.body.setVelocityX(0)
  }
  if(keys[5].isDown && player2.body.touching.down){
    player2.body.setVelocityY(-300)
  }
}

export function handleUserInput1(game){
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