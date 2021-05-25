//this is called when a player and button collide. obj2 refers to the button
export function handleButtonPress(obj1, button){
    button.on = true
}

//this is called when a player and lever collide. It turns the lever on or off if the interaction key has been pressed
export function handleLeverPress(player, lever){
    if(player.interactionKey.isDown && !player.interactionKey.pressed){
        player.interactionKey.pressed = true
        if(Math.round(lever.rotation,5) === Math.round(45*Math.PI/180,5)){
            lever.setRotation(-45*Math.PI/180)
            lever.on = false
        }
        else{
            lever.setRotation(45*Math.PI/180)
            lever.on = true
        }
    }
}

//called when a player and collides with a spike. The player moves back to their last safe position
export function handleSpikeCollision(player, spike){
    player.setPosition(player.safePos.x, player.safePos.y)
}

//called when a player and enemy collide. Sends the player back to the spawn point
export function handleEnemyCollision(player, enemy){
    player.setPosition(player.origin.x, player.origin.y)
}

//sets the player's safe position if they are on a static platform
export function setSafePlayerPosition(player, platform){
    if(player.body.touching.down){
        player.safePos.x = player.x
        player.safePos.y = player.y
    }
}

export function handleExitDoorCollision(player, exitDoor){
    exitDoor.playerCount += 1
    if(exitDoor.playerCount === 2){
        console.log("level complete")
    }
}