import Phaser from "phaser"

//creating the static platforms for the level from an array of objects containg positioning and size
export function createNewPlatforms(game, physicsGroup, platformData){
    let newPlatform;
    for(let i = 0; i < platformData.length; i++){
        newPlatform = game.add.rectangle(platformData[i].x, platformData[i].y, platformData[i].w, platformData[i].h, 0x00ff00)
        physicsGroup.add(newPlatform)
    }
}

//creating a new player and returning it
export function createNewPlayer(game, physicsGroup, x, y){
    let player = game.add.rectangle(x, y, 50, 50, 0xff0000)
    physicsGroup.add(player)
    return player
}

//creating the key listeners for keyboard input
export function createNewKeys(game){
    game.left = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    game.right = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    game.up = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
}

//creating the side-scrolling camera
export function createFollowCamera(game, playerToFollow){
    game.cameras.main.setBounds(0, 0, 1600, 600)
    game.cameras.main.startFollow(playerToFollow)
}

//creating the moving platforms and setting the information for the target position to move to
export function createNewMovingPlatform(game, physicsGroup, info, target, increment, trigger){
    let movingPlatform = game.add.rectangle(info.x, info.y, info.w, info.h, 0x0000ff)
    physicsGroup.add(movingPlatform)
    //the moving platforms need gravity turned off and are set to not be moved by collisions
    movingPlatform.body.allowGravity = false
    movingPlatform.body.immovable = true
    movingPlatform.origin = {x:info.x, y:info.y}
    movingPlatform.target = target
    movingPlatform.increment = increment
    //the trigger is the button that tells the platform to move or not
    movingPlatform.trigger = trigger
    return movingPlatform
}

//create a new button
export function createNewButton(game, physicsGroup, info){
    let button = game.add.rectangle(info.x, info.y, info.w, info.h, 0xffff00)
    physicsGroup.add(button)
    button.on= false
    return button
}