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
    game.buttons.children.entries.forEach((button)=>{
        button.on = false
    })
}

//set the velocity of the box back to 0, so they stop after being pushed
export function resetBoxVelocity(game){
    game.boxes.children.entries.forEach((box)=>{
        box.body.setVelocityX(0)
    })
}

//called every frame to move the enemies
export function moveEnemies(game){
    game.enemies.children.entries.forEach((enemy)=>{
        if(!enemy.seekPlayer){
            enemy.setPosition(enemy.x+enemy.moveSpeed, enemy.y)
            if(enemy.x <= enemy.patrolPath.x1){
                enemy.moveSpeed = Math.abs(enemy.moveSpeed)
            }
            else if(enemy.x > enemy.patrolPath.x2){
                enemy.moveSpeed = -Math.abs(enemy.moveSpeed)
            }
        }
    })
}

//if the distance of an enemy to player is less than 150, then the enemy will move towards the player istead of following the patrol path
export function checkEnemyDistanceToPlayer(game){
    game.enemies.children.entries.forEach((enemy)=>{
        game.players.children.entries.forEach((player)=>{
            let distanceToPlayer = player.x-enemy.x
            if(Math.abs(distanceToPlayer) < 150  && enemy.y === player.y){
                enemy.seekPlayer = true
                if(distanceToPlayer > 0){
                    enemy.setPosition(enemy.x+Math.abs(enemy.moveSpeed), enemy.y)
                }
                else{
                    enemy.setPosition(enemy.x-Math.abs(enemy.moveSpeed), enemy.y)
                }
            }
            else{
                enemy.seekPlayer = false
            }
        })
    })
}