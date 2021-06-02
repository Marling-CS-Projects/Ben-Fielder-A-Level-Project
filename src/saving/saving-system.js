//save an object to local storage with a key
export function save(saveKey, objectToSave){
    localStorage.setItem(saveKey, JSON.stringify(objectToSave))
}

//load data from loacal storage with a key
export function load(saveKey){
    return JSON.parse(localStorage.getItem(saveKey))
}

//when a level is completed it will save the highest level completed
export function levelComplete(levelCompleted){
    let currentLevelsComplete = load("levels-complete")
    if(levelCompleted > currentLevelsComplete){
        save("levels-complete", levelCompleted)
    }
}

//called when the user clicks on new game. It restarts their progress by saving levels complete as 0
export function restartGame(){
    save("levels-complete", 0)
}