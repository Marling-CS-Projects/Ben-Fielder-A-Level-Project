//called every frame to move the player in response to key presses
export function handleUserInput(game, scale){
  game.players.children.entries.forEach((player)=>{
    if(player.left.isDown){
      player.body.setVelocityX(-100*scale)
      if(player.anims){
        player.anims.play("run"+player.playerNum, true)
        player.animation = "run"+player.playerNum
        player.flipX = true
      }
    }
    else if(player.right.isDown){
      player.body.setVelocityX(100*scale)
      if(player.anims){
        player.anims.play("run"+player.playerNum, true)
        player.animation = "run"+player.playerNum
        player.flipX = false
      }
    }
    else{
      player.body.setVelocityX(0)
      if(player.anims){
        player.anims.play("rest"+player.playerNum, true)
        player.animation = "rest"+player.playerNum
      }
    }
    if(player.up.isDown && player.body.touching.down){
      player.body.setVelocityY(-300*scale)
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

//called every frame to check if the pause button has been pressed
export function checkPause(game, currentLevel, callFunction){
  if(game.pauseButton.isDown){
    game.scene.pause("Level"+currentLevel.toString())
    callFunction("Level"+currentLevel.toString())
    game.scene.launch("PauseMenu")
  }
}