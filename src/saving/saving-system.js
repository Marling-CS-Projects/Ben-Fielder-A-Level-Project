export function save(saveKey, objectToSave){
    localStorage.setItem(saveKey, JSON.stringify(objectToSave))
}

export function load(saveKey){
    return JSON.parse(localStorage.getItem(saveKey))
}

export function levelComplete(levelCompleted){
    let currentLevelsComplete = load("levels-complete")
    if(levelCompleted > currentLevelsComplete){
        save("levels-complete", levelCompleted)
    }
}