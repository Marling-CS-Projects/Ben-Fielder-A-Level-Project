//importing the express library and creating the app
const express = require("express")
const app = express()
const server = require("http").Server(app)

//importing the socket.io library
const io = require("socket.io").listen(server)

//settting the port to the predefined one or to default to 4000
const port = process.env.PORT || 4000

//importing the jsdom library
const jsdom = require("jsdom")
const { JSDOM } = jsdom

//importing the random name generator
const generator = require("project-name-generator")

//serving all files in the build folder
app.use(express.static(__dirname + "/build"))

//setting the default html page of the website as the index.html from the react app build
app.get("/", (req,res)=>{
    res.sendFile(__dirname + '/build/index.html')
})

//setting up the script to run on the server and to feed information to each player who joins
JSDOM.fromFile(__dirname + "/server/star-collector/index.html",{
    //setup so all scripts can be run
    runScripts:"dangerously",
    resources:"usable",
    pretendToBeVisual:true
}).then((dom)=>{
    //allows the window to use socket.io
    dom.window.io = io
    //allows the window to use the name generator
    dom.window.nameGenerator = generator
}).catch((error)=>{
    console.log(error.message)
})

//setting up the script to run on the server and to feed information to each player who joins
JSDOM.fromFile(__dirname + "/server/football/index.html",{
    //setup so all scripts can be run
    runScripts:"dangerously",
    resources:"usable",
    pretendToBeVisual:true
}).then((dom)=>{
    //allows the window to use socket.io
    dom.window.io = io
    //allows the window to use the name generator
    dom.window.nameGenerator = generator
}).catch((error)=>{
    console.log(error.message)
})

//starts the server
server.listen(port, function () {
    console.log(`Listening on ${server.address().port}`)
})