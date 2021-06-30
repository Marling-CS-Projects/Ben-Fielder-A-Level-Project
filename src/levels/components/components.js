import Phaser from "phaser"

//creating the static platforms for the level from an array of objects containg positioning and size
export function createNewPlatforms(game, physicsGroup, platformData, scale){
    let newPlatform;
    for(let i = 0; i < platformData.length; i++){
        newPlatform = game.add.rectangle(platformData[i].x*scale, platformData[i].y*scale, platformData[i].w*scale, platformData[i].h*scale, 0x00ff00)
        physicsGroup.add(newPlatform)
    }
}

//creating a new player and returning it
export function createNewPlayer(game, physicsGroup, x, y, scale){
    let player = game.add.rectangle(x*scale, y*scale, 50*scale, 50*scale, 0xff0000)
    physicsGroup.add(player)
    player.origin = {x:player.x,y:player.y}
    player.safePos = {x:player.x,y:player.y}
    player.atExit = false
    return player
}

//creating the key listeners for keyboard input
export function createNewKeys(game){
    game.player1.left = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    game.player1.right = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    game.player1.up = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    game.player1.interactionKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACK_SLASH)
    game.player1.interactionKey.pressed = false

    game.player2.left = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    game.player2.right = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    game.player2.up = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    game.player2.interactionKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    game.player2.interactionKey.pressed = false

    game.pauseButton = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
}

//creating the side-scrolling camera
export function createFollowCamera(game, playerToFollow, bounds, scale){
    game.cameras.main.setBounds(bounds.x1*scale, bounds.y1*scale, bounds.x2*scale, bounds.y2*scale)
    game.cameras.main.startFollow(playerToFollow)
}

//creating the moving platforms and setting the information for the target position to move to
export function createNewMovingPlatform(game, physicsGroup, info, target, increment, trigger, scale){
    let movingPlatform = game.add.rectangle(info.x*scale, info.y*scale, info.w*scale, info.h*scale, 0x0000ff)
    physicsGroup.add(movingPlatform)
    //the moving platforms need gravity turned off and are set to not be moved by collisions
    movingPlatform.body.allowGravity = false
    movingPlatform.body.immovable = true
    movingPlatform.origin = {x:movingPlatform.x, y:movingPlatform.y}
    if(target){
        movingPlatform.target = {x:target.x*scale,y:target.y*scale}
    }
    if(increment){
        movingPlatform.increment = {x:increment.x*scale,y:increment.y*scale}
    }
    //the trigger is the button that tells the platform to move or not
    movingPlatform.trigger = trigger
    return movingPlatform
}

//creates a new finish platform. They are fairly similar to moving platforms
export function createNewFinishPlatform(game, physicsGroup, info, targetBody, scale){
    let finishPlatform = game.add.rectangle(info.x*scale, info.y*scale, info.w*scale, info.h*scale, 0x0000ff)
    physicsGroup.add(finishPlatform)
    finishPlatform.targetBody = targetBody
    return finishPlatform
}

//create a new box
export function createNewBox(game, physicsGroup, info, scale){
    let box = game.add.rectangle(info.x*scale, info.y*scale, info.w*scale, info.h*scale, 0xff00ff)
    physicsGroup.add(box)
    return box
}

//create a new button
export function createNewButton(game, physicsGroup, info, scale){
    let button = game.add.rectangle(info.x*scale, info.y*scale, info.w*scale, info.h*scale, 0xffff00)
    physicsGroup.add(button)
    button.on = false
    return button
}

//create a new lever
export function createNewLever(game, physicsGroup, info, scale){
    let lever = game.add.rectangle(info.x*scale, info.y*scale, info.w*scale, info.h*scale, 0x00ffff)
    physicsGroup.add(lever)
    lever.setRotation(-45*Math.PI/180)
    lever.on = false
    return lever
}

//create a set of spikes
export function createNewSpikeSet(game, physicsGroup, info, count, scale){
    let spike
    for(let i = 0; i < count; i++){
        spike = game.add.triangle((info.x+i*25)*scale, (info.y-12)*scale, 0*scale, 25*scale, 25*scale, 25*scale, 12*scale, 0*scale, 0xffffff)
        physicsGroup.add(spike)
    }
}

//create a new enemy
export function createNewEnemy(game, physicsGroup, info, target, moveSpeed, scale){
    let enemy = game.add.rectangle(info.x*scale, info.y*scale, 50*scale, 50*scale, 0xdf7000)
    physicsGroup.add(enemy)
    enemy.patrolPath = {x1:info.x*scale,x2:target*scale}
    enemy.moveSpeed = moveSpeed*scale
    enemy.seekPlayer = false
    return enemy
}

//create an exit door
export function createNewExitDoor(game, physicsGroup, info, floor, scale){
    let exitDoor = game.add.rectangle(info.x*scale, info.y*scale, 50*scale, 100*scale, 0xaaaaaa)
    physicsGroup.add(exitDoor)
    exitDoor.body.allowGravity = false
    exitDoor.body.immovable = true
    exitDoor.floor = floor
    exitDoor.levelComplete = false
    return exitDoor
}

//creating a trap. It stores the values for some platforms to create if it is triggered
export function createNewTrap(game, trapPhysicsGroup, trigger, platformData){
    let trap = game.add.rectangle(0,0,0,0,0x000000)
    trap.initialised = false
    trap.trigger = trigger
    trap.trapPlatforms = platformData
    trap.trapPlatformsPhysicsGroup = trapPhysicsGroup
    return trap
}

//create new text for in the level. Seperates it out over multiple lines
export function createNewGameText(game, group, info, text, lines, scale){
    text = text.split(" ")
    let wordsPerLine = Math.ceil(text.length / lines)
    let currentText
    let word = 0
    for(let j = 0; j < lines; j++){
        currentText = ""
        for(let k = 0; k < wordsPerLine; k++){
            if(text[word]){
                currentText+=(text[word]+" ")
                word++
            }
        }
        group.add(game.add.text(info.x*scale, (info.y+j*20)*scale, currentText, {font: "20px Arial", fill: "#552eff"}).setOrigin(0.5, 0.5))
    }
    
}