//called every frame to move the player in response to key presses
export function handleUserInput(game){
  game.players.children.entries.forEach((player)=>{
    if(player.left.isDown){
      player.body.setVelocityX(-100)
    }
    else if(player.right.isDown){
      player.body.setVelocityX(100)
    }
    else{
      player.body.setVelocityX(0)
    }
    if(player.up.isDown && player.body.touching.down){
      player.body.setVelocityY(-300)
    }
  })
}

//called every frame to check if the interaction keys have been released
export function checkInteractionKeyPress(game){
  game.players.children.entries.forEach((player)=>{
    if(!player.interactionKey.isDown){
      player.interactionKey.pressed = false
    }
  })
}