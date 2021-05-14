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