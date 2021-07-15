//create a new button. It has a function and value to call if the button is pressed
export function createNewButton(game, group, info, scale, text, colour, callFunction, callValue, sprite){
    let button
    if(sprite){
        button = game.add.sprite(info.x*scale, info.y*scale, sprite)
        button.setDisplaySize(info.w*scale, info.h*scale)
        game.anims.create({
            key: "off"+sprite,
            frames: [{key: sprite, frame:0}],
            frameRate: 5,
        })
        game.anims.create({
            key: "over"+sprite,
            frames: [{key: sprite, frame:1}],
            frameRate: 5,
        })
        game.anims.create({
            key: "down"+sprite,
            frames: [{key: sprite, frame:2}],
            frameRate: 5,
        })
        button.sprite = sprite
    }
    else{
        button = game.add.rectangle(info.x*scale, info.y*scale, info.w*scale, info.h*scale, colour)
    }
    button.w = info.w*scale
    button.h = info.h*scale
    button.text = game.add.text(info.x+5, info.y-5, text.text, {font: text.font, fill: text.fill}).setOrigin(0.5, 0.5)
    button.text.setPosition(button.text.x*scale, button.text.y*scale)
    button.text.setDisplaySize(button.text.width*scale, button.text.height*scale)
    button.callFunction = callFunction
    button.callValue = callValue
    group.add(button)
    return button
}

//create new text
export function createNewText(game, group, info, scale, textInfo){
    let text = game.add.text(info.x+5, info.y-5, textInfo.text, {font: textInfo.font, fill: textInfo.fill}).setOrigin(0.5, 0.5)
    text.setPosition(text.x*scale, text.y*scale)
    text.setDisplaySize(text.width*scale, text.height*scale)
    group.add(text)
    return text
}