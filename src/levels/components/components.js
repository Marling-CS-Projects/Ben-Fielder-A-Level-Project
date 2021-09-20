import Phaser from "phaser"

//creating the static platforms for the level from an array of objects containg positioning and size
export function createNewPlatforms(game, physicsGroup, platformData, scale, sprite1, sprite2, wallGroup){
    let newPlatform
    if(sprite1){
        for(let i = 0; i < platformData.length; i++){
            if(platformData[i].h === 50){
                newPlatform = game.add.sprite(platformData[i].x*scale, platformData[i].y*scale, sprite1)
            }
            else{
                newPlatform = game.add.sprite(platformData[i].x*scale, platformData[i].y*scale, sprite2)
            }
            newPlatform.setDisplaySize(platformData[i].w*scale, platformData[i].h*scale)
            physicsGroup.add(newPlatform)
        }
    }
    else{
        for(let i = 0; i < platformData.length; i++){
            newPlatform = game.add.rectangle(platformData[i].x*scale, platformData[i].y*scale, platformData[i].w*scale, platformData[i].h*scale, 0x00ff00)
            physicsGroup.add(newPlatform)
        }
    }

    if(wallGroup){
        for(let i = 0; i < platformData.length; i++){
            wallGroup.add(game.add.rectangle((platformData[i].x-platformData[i].w/2)*scale, (platformData[i].y-platformData[i].h/2)*scale, 5, 50, 0xffffff).setAlpha(0))
            wallGroup.add(game.add.rectangle((platformData[i].x+platformData[i].w/2)*scale, (platformData[i].y-platformData[i].h/2)*scale, 5, 50, 0xffffff).setAlpha(0))
        }
    }
}

//creating a new player and returning it
export function createNewPlayer(game, physicsGroup, x, y, scale, sprite){
    let player
    if(sprite === "p1"){
        player = game.add.sprite(x*scale, y*scale, sprite)
        player.setDisplaySize(50*scale, 50*scale)
        game.anims.create({
            key: "run1",
            frames: [{key: "p1run1"}, {key: "p1run2"}],
            frameRate: 5,
            repeat: -1
        })
        game.anims.create({
            key: "rest1",
            frames: [{key: "p1"}],
            frameRate: 20
        })
        player.animation = "rest1"
        player.playerNum = "1"
    }
    else if(sprite === "p2"){
        player = game.add.sprite(x*scale, y*scale, sprite)
        player.setDisplaySize(50*scale, 50*scale)
        game.anims.create({
            key: "run2",
            frames: [{key: "p2run1"}, {key: "p2run2"}],
            frameRate: 5,
            repeat: -1
        })
        game.anims.create({
            key: "rest2",
            frames: [{key: "p2"}],
            frameRate: 20
        })
        player.animation = "rest2"
        player.playerNum = "2"
    }
    else{
        player = game.add.rectangle(x*scale, y*scale, 50*scale, 50*scale, 0xff0000)
    } 
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
    game.player1.interactionKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
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
export function createNewMovingPlatform(game, physicsGroup, info, target, increment, trigger, scale, sprite){
    let movingPlatform
    if(sprite){
        movingPlatform = game.add.sprite(info.x*scale, info.y*scale, sprite)
        movingPlatform.setDisplaySize(info.w*scale, info.h*scale)
    }
    else{
        movingPlatform = game.add.rectangle(info.x*scale, info.y*scale, info.w*scale, info.h*scale, 0x0000ff)
    }
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
export function createNewFinishPlatform(game, physicsGroup, info, targetBody, scale, sprite){
    let finishPlatform
    if(sprite){
        finishPlatform = game.add.sprite(info.x*scale, info.y*scale, sprite)
        finishPlatform.setDisplaySize(info.w*scale, info.h*scale)
    }
    else{
        finishPlatform = game.add.rectangle(info.x*scale, info.y*scale, info.w*scale, info.h*scale, 0x0000ff)
    }
    physicsGroup.add(finishPlatform)
    finishPlatform.targetBody = targetBody
    return finishPlatform
}

//create a new box
export function createNewBox(game, physicsGroup, info, scale, sprite){
    let box
    if(sprite){
        box = game.add.sprite(info.x*scale, info.y*scale, sprite)
        box.setDisplaySize(info.w*scale, info.h*scale)
    }
    else{
        box = game.add.rectangle(info.x*scale, info.y*scale, info.w*scale, info.h*scale, 0xff00ff)
    }
    physicsGroup.add(box)
    return box
}

//create a new button
export function createNewButton(game, physicsGroup, info, scale, sprite){
    let button
    if(sprite){
        button = game.add.sprite(info.x*scale, info.y*scale-10*scale, sprite)
        button.setDisplaySize(info.w*scale, info.w*scale)
        game.anims.create({
            key: "off",
            frames: [{key: "buttonup"}],
            frameRate: 5,
        })
        game.anims.create({
            key: "on",
            frames: [{key: "buttondown"}],
            frameRate: 5,
        })
        button.animation = "off"
    }
    else{
        button = game.add.rectangle(info.x*scale, info.y*scale, info.w*scale, info.h*scale, 0xffff00)
    }
    physicsGroup.add(button)
    button.on = false
    return button
}

//create a new lever
export function createNewLever(game, physicsGroup, info, scale, sprite){
    let lever
    if(sprite){
    lever = game.add.sprite(info.x*scale, info.y*scale-17*scale, sprite)
        lever.setDisplaySize(info.w*scale, info.w*(100/128)*scale)
        game.anims.create({
            key: "lever-off",
            frames: [{key: "lever", frame:0}],
            frameRate: 5,
        })
        game.anims.create({
            key: "lever-on",
            frames: [{key: "lever", frame:1}],
            frameRate: 5,
        })
        lever.animation = "lever-off"
    }
    else{
        lever = game.add.rectangle(info.x*scale, info.y*scale, info.w*scale, info.h*scale, 0x00ffff)
        lever.setRotation(-45*Math.PI/180)
    }
    physicsGroup.add(lever)
    lever.on = false
    return lever
}

//create a set of spikes
export function createNewSpikeSet(game, physicsGroup, info, count, scale, sprite){
    let spike
    if(sprite){
        for(let i = 0; i < count; i++){
            spike = game.add.sprite((info.x+i*25)*scale, (info.y-10)*scale, sprite)
            spike.setDisplaySize(25, 25)
            physicsGroup.add(spike)
        }
    }
    else{
        for(let i = 0; i < count; i++){
            spike = game.add.triangle((info.x+i*25)*scale, (info.y-12)*scale, 0*scale, 25*scale, 25*scale, 25*scale, 12*scale, 0*scale, 0xffffff)
            physicsGroup.add(spike)
        }
    }
}

//create a new enemy
export function createNewEnemy(game, physicsGroup, info, target, moveSpeed, scale, sprite){
    let enemy
    if(sprite){
        enemy = game.add.sprite(info.x*scale, info.y*scale, sprite)
        enemy.setDisplaySize(enemy.width/2, enemy.height/2)
        game.anims.create({
            key: "move",
            frames: [{key: "enemy1"}, {key: "enemy2"}],
            repeat: -1,
            frameRate: 3,
        })
        enemy.anims.play("move")
    }
    else{
        enemy = game.add.rectangle(info.x*scale, info.y*scale, 50*scale, 50*scale, 0xdf7000)
    }
    physicsGroup.add(enemy)
    enemy.patrolPath = {x1:info.x*scale,x2:target*scale}
    enemy.moveSpeed = moveSpeed*scale
    enemy.seekPlayer = false
    return enemy
}

//create an exit door
export function createNewExitDoor(game, physicsGroup, info, floor, scale, sprite){
    let exitDoor
    if(sprite){
        exitDoor = game.add.sprite(info.x*scale, info.y*scale, sprite)
        exitDoor.setDisplaySize(50*scale, 75*scale)
    }
    else{
        exitDoor = game.add.rectangle(info.x*scale, info.y*scale, 50*scale, 100*scale, 0xaaaaaa)
    }
    physicsGroup.add(exitDoor)
    exitDoor.body.allowGravity = false
    exitDoor.body.immovable = true
    exitDoor.floor = floor
    exitDoor.levelComplete = false
    return exitDoor
}

//creating a trap. It stores the values for some platforms to create if it is triggered
export function createNewTrap(game, trapPhysicsGroup, trigger, platformData, sprite){
    let trap = game.add.rectangle(0,0,0,0,0x000000)
    trap.initialised = false
    trap.trigger = trigger
    trap.trapPlatforms = platformData
    trap.trapPlatformsPhysicsGroup = trapPhysicsGroup
    trap.sprite = sprite
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
        group.add(game.add.text(info.x*scale, (info.y+j*20)*scale, currentText, {font: "20px Future", fill: "#552eff"}).setOrigin(0.5, 0.5))
    }
    
}