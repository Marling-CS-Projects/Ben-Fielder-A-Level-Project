//create a new button. It has a function and value to call if the button is pressed
export function createNewButton(game, group, info, text, colour, callFunction, callValue){
    let button = game.add.rectangle(info.x, info.y, info.w, info.h, colour)
    button.text = game.add.text(info.x, info.y, text.text, {font: text.font, fill: text.fill}).setOrigin(0.5, 0.5)
    button.callFunction = callFunction
    button.callValue = callValue
    group.add(button)
    return button
}

//create new text
export function createNewText(game, group, info, textInfo){
    let text = game.add.text(info.x, info.y, textInfo.text, {font: textInfo.font, fill: textInfo.fill}).setOrigin(0.5, 0.5)
    group.add(text)
    return text
}