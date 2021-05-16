//called every frame to move the moving platforms
export function moveMovingPlatforms(game){
    game.movingPlatforms.children.entries.forEach((movingPlatform)=>{
      if(movingPlatform.trigger === null || movingPlatform.trigger.on){
        movingPlatform.setPosition(movingPlatform.x+movingPlatform.increment.x, movingPlatform.y+movingPlatform.increment.y)
        if(movingPlatform.x === movingPlatform.origin.x){
          movingPlatform.increment.x = movingPlatform.increment.x*-1
        }
        else if(movingPlatform.x === movingPlatform.target.x){
          movingPlatform.increment.x = movingPlatform.increment.x*-1
        }
        if(movingPlatform.y === movingPlatform.origin.y){
          movingPlatform.increment.y = movingPlatform.increment.y*-1
        }
        else if(movingPlatform.y === movingPlatform.target.y){
          movingPlatform.increment.y = movingPlatform.increment.y*-1
        }
      }
    })
}

//default value for button.on should be set to false
export function resetButtonValues(game){
    game.button.on = false
}

//set the velocity of the box back to 0, so they stop after being pushed
export function resetBoxVelocity(game){
    game.boxes.children.entries.forEach((box)=>{
        box.body.setVelocityX(0)
    })
}

//when a player collides with a spike, they will be set to this position
export function setLastSafePlayerPosition(game){
    game.players.children.entries.forEach((player)=>{
        if(player.body.touching.down){
            player.safePos.x = player.x
            player.safePos.y = player.y
        }
    })
}