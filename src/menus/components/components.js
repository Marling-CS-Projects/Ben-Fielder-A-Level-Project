//create a new button. It has a function and value to call if the button is pressed
export function createNewButton(game, group, info, scale, text, colour, callFunction, callValue){
    let button = game.add.rectangle(info.x, info.y, info.w, info.h, colour)
    button.setPosition(button.x*scale, button.y*scale)
    button.setDisplaySize(button.width*scale, button.height*scale)
    button.text = game.add.text(info.x, info.y, text.text, {font: text.font, fill: text.fill}).setOrigin(0.5, 0.5)
    button.text.setPosition(button.text.x*scale, button.text.y*scale)
    button.text.setDisplaySize(button.text.width*scale, button.text.height*scale)
    button.callFunction = callFunction
    button.callValue = callValue
    group.add(button)
    return button
}

//create new text
export function createNewText(game, group, info, scale, textInfo){
    let text = game.add.text(info.x, info.y, textInfo.text, {font: textInfo.font, fill: textInfo.fill}).setOrigin(0.5, 0.5)
    text.setPosition(text.x*scale, text.y*scale)
    text.setDisplaySize(text.width*scale, text.height*scale)
    group.add(text)
    return text
}