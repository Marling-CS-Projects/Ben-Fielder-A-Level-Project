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
            if(enemy.x <= enemy.patrolPath.x1){
                enemy.body.setVelocityX(enemy.moveSpeed)
            }
            else if(enemy.x >= enemy.patrolPath.x2){
                enemy.body.setVelocityX(-enemy.moveSpeed)
            }
        }
    })
}

//if the distance of an enemy to player is less than 150, then the enemy will move towards the player istead of following the patrol path
export function checkEnemyDistanceToPlayer(game){
    game.enemies.children.entries.forEach((enemy)=>{
        let targetingPlayer = false
        game.players.children.entries.forEach((player)=>{
            let distanceToPlayer = player.x-enemy.x
            let distanceToPlayerSpawn = player.origin.x-enemy.x
            if(Math.abs(distanceToPlayer) < 150 && enemy.y === player.safePos.y && (Math.abs(distanceToPlayerSpawn) > 75 || enemy.y !== player.origin.y)){
                enemy.seekPlayer = true
                targetingPlayer = true
                if(distanceToPlayer > 0){
                    enemy.body.setVelocityX(enemy.moveSpeed)
                }
                else{
                    enemy.body.setVelocityX(-enemy.moveSpeed)
                }
                return
            }
            else if(!targetingPlayer){
                enemy.seekPlayer = false
            }
        })
    })
}

//move the exit door to stay on the platform
export function moveExitDoor(game){
    game.exitDoors.children.entries.forEach((exitDoor)=>{
        exitDoor.setPosition(exitDoor.floor.x, exitDoor.floor.y-50)
        exitDoor.playerCount = 0
    })
}

//The finish platform needs a body for the players to stand on
export function moveFinishPlatformBody(finishPlatform){
    finishPlatform.targetBody.setPosition(finishPlatform.x, finishPlatform.y)
}

//if the trigger for the trap has been set, then the trap platforms are created. The trap can only be deployed once and can't be undone.
export function checkTrap(game, trap, createPlatformsFunction1, createPlatformsFunction2){
    if(trap.initialised){
        return
    }
    else if(trap.trigger.on){
        trap.initialised = true
        createPlatformsFunction1(game, trap.trapPlatformsPhysicsGroup, trap.trapPlatforms)
        createPlatformsFunction2(trap.trapPlatforms)
    }
}

//set the default value for players being at the exit as false
export function resetPlayerAtExit(game){
    game.players.children.entries.forEach((player)=>{
        player.atExit = false
    })
}

//if both players are at the exit in the same frame, then load the next scene
export function checkPlayersAtExit(game, sceneToLoad){
    let playersAtExit = 0
    game.players.children.entries.forEach((player)=>{
        if(player.atExit){
            playersAtExit += 1
        }
    })
    if(playersAtExit >= 2){
        game.scene.start(sceneToLoad)
    }
}