let courseOptionsHtml = '';
let golfCourseId = '';
let currentCourseInfo = '';
let currentCourse = '';
let currentHole = 0;
let currentTeeBox = '';
let TeeBoxArr = [];
let teeBoxValue = 0;
var newUser = ''
var newId = 0
var currentHoleNumber = 0 
var playerArr = []
var playerLimit = false
var playerCount = 0
var currentScore = ''

// API call to get the available courses
async function getAvailableCourses() {
        const url = 'https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json';
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

// A promise that gets the results of available courses then creates a string thats set to the variable courseOptionsHtml
const availableCoursesPromise = new Promise((resolve,reject) => {
    resolve(pushAvailableCourses())
    async function pushAvailableCourses(){
        let courses = await getAvailableCourses()
        courses.forEach(course => {
            courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`
        })
        return courseOptionsHtml
    }
})

// Sets the html of course select to the new courseOptionsHtml
availableCoursesPromise.then((value) => {
    document.getElementById('course-select').innerHTML =  value;
})

const courseIdPromise = new Promise((resolve,reject) => {
    resolve(IdFinder())
    async function IdFinder(){
        let courses = await getAvailableCourses()
            return courses
    }
})

function getCourseId(){
    courseIdPromise.then(() => {
        golfCourseId = document.getElementById("course-select").value
        getCourseInfo()
        selectTeeBox()
        // document.querySelector('.page-1').style.display = "none"
        
        document.querySelector('.page-2').style.display = "block"
    })
}


async function getCourseInfo() {
    const url = `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`
    const response = await fetch(url);
    const data = await response.json();
    currentCourseInfo = data
    return data;
}

async function selectTeeBox() {
        currentCourseInfo = await getCourseInfo();
        let teeBoxSelectHtml = ''
        currentTeeBox = currentCourseInfo.holes[currentHole].teeBoxes
        currentTeeBox.forEach(function (teeBox, index){
            teeBoxSelectHtml += `<option class="teeBoxes value="${index}">${teeBox.teeType.toUpperCase()}, ${teeBox.yards}`
        })
        
        document.getElementById('teebox-select').innerHTML = teeBoxSelectHtml
        
}

function selectCurrentTeeBox(){
    teeBoxValue = document.getElementById('teebox-select').selectedIndex
    addPlayerHtml()
}


function addPlayerHtml(){
    document.querySelector('.page-3').style.display = "flex"
    document.querySelector('.page-2').style.display = "block"
    document.querySelector('.addNewUser').style.display = 'block'
}




function selectNextHole(){
    for(i = 0; i < (newUser.id); i++){
        console.log(document.querySelector(`#player${(i + 1)}score`).value === "")
        if(document.querySelector(`#player${(i + 1)}score`).value === ""){
            alert('Please Enter A Score For Each Player')
            return
        }
        
    }
    
    let player1 = document.querySelector('.players').firstElementChild
    let nextPlayer = player1.nextElementSibling

    if(currentHoleNumber < 17){
        currentHoleNumber = currentHoleNumber + 1
    }


    if(newUser.id !== 1){
        if(playerArr[1].scores[currentHoleNumber - 1] === undefined){
            if(playerArr[0].scores[currentHoleNumber - 1] === undefined){
                playerArr[0].scores.push(player1.firstElementChild.value)
            }
            
            for(i = 1; i < (newUser.id); i++){
                playerArr[i].scores.push(nextPlayer.firstElementChild.value)
                nextPlayer = nextPlayer.nextElementSibling
            }
            nextPlayer = player1.nextElementSibling
        }
    
        for(i = 0; i < (newUser.id); i++){
            document.querySelector(`#player${(i + 1)}score`).value = ""
        }
    }
    else{
        if(playerArr[0].scores[currentHoleNumber - 1] === undefined){
            if(playerArr[0].scores[currentHoleNumber - 1] === undefined){
                playerArr[0].scores.push(player1.firstElementChild.value)
            }
        }
        for(i = 0; i < (newUser.id); i++){
            document.querySelector(`#player${(i + 1)}score`).value = ""
        }
    }
   

    
    displayCourseInfo()
    addScoreToTable()
}

let currentScoreElementIndex = 1;

function addScoreToTable(){

    if(currentScoreElementIndex === 18){
        alert('Game is Over')
    }

    for(let i = 0; i < newUser.id; i++){

        let currentScore = document.querySelector(`.player${i + 1}score-sheet`).children[currentScoreElementIndex];
        console.log(currentScore)
        currentScore.innerHTML = playerArr[i].scores[currentHoleNumber - 1];

    }
    currentScoreElementIndex++;
}



async function displayCourseInfo() {
    
    currentCourseInfo = await getCourseInfo();
    let currentHoleCounter = 1
    let currentHolesHtml = ''
    let currentYard = ''
    let currentPar = ''
    let currentHandicap = ''
    let currentHoleArr = []

    currentCourseInfo.holes.forEach(elm => {
        currentHolesHtml += `<td>${currentHoleCounter}</td>`
        currentHoleArr.push(currentHoleCounter)
        currentHoleCounter++
        
    })
    for (let i =0; i < currentCourseInfo.holes.length; i++){
        currentYard += `<td>${currentCourseInfo.holes[i].teeBoxes[teeBoxValue].yards}</td>`
        currentPar += `<td>${currentCourseInfo.holes[i].teeBoxes[teeBoxValue].par}</td>`
        currentHandicap += `<td>${currentCourseInfo.holes[i].teeBoxes[teeBoxValue].hcp}</td>`
    }



    document.querySelector('.table').style.display = "block"
    document.querySelector('.addNewUser').style.display = "block"
    document.querySelector('.currentHoleTable').style.display = "block"
    document.querySelector('.page-1').style.display = "none"
    document.querySelector('.page-2').style.display = "none"
    document.querySelector('.page-3').style.display = "none"
    let currentHolesTable = `<tr>${currentHolesHtml}</tr>`
    document.querySelector('.holesRow').innerHTML = '<th>Holes</th>' + currentHolesTable
    document.querySelector('.yardageRow').innerHTML = '<th>Yardage</th>' + currentYard
    document.querySelector('.parRow').innerHTML = '<th>Par</th>' + currentPar
    document.querySelector('.handicapRow').innerHTML = '<th>Handicap</th>' + currentHandicap

    
   
     
    


    document.querySelector('.currentHoleNumber').innerHTML = 'Hole Number: ' + currentHoleArr[currentHoleNumber]
    document.querySelector('.currentYardage').innerHTML =  "Yardage: " + currentCourseInfo.holes[currentHoleNumber].teeBoxes[teeBoxValue].yards
    document.querySelector('.currentPar').innerHTML = 'Par: ' + currentCourseInfo.holes[currentHoleNumber].teeBoxes[teeBoxValue].par
    document.querySelector('.currentHandicap').innerHTML = 'Handicap: ' + currentCourseInfo.holes[currentHoleNumber].teeBoxes[teeBoxValue].hcp
    
}

function displayScoreBoard(){
    document.querySelector('#scorecard-container').style.display = "flex"
}

function displayPopup (){
    if(playerLimit === false){
        var popupWindow = document.querySelector('.popupWindow');
        var popupButton = document.querySelector('.addNewUser');
        var closePopup = document.querySelector('.closeButton');
        popupWindow.style.display = "flex"
        document.querySelector('.container').opacity = "50%"
    }
    else {
        alert('Player Limit Has Been Reached')
    }
}  

function closePopup (){
    var popupWindow = document.querySelector('.popupWindow');
    var popupButton = document.querySelector('.addNewUser');
    var closePopup = document.querySelector('.closeButton');
    popupWindow.style.display = "none"
}

class Player {
    constructor(name, id = getNextId()(), scores = []) {
      this.name = name;
      this.id = id;
      this.scores = scores;
    }
  }


function getNextId(){
    
    return function playerId(){
        newId = newId + 1
        return newId  
    }
}




function submitNewPlayer(){
    var popupWindow = document.querySelector('.popupWindow');
    var popupButton = document.querySelector('.addNewUser');
    var closePopup = document.querySelector('.closeButton');
    var playerName = document.querySelector('.newPlayerName').value
    if (playerName !== " "){
        newUser = new Player(playerName)
        playerArr.push(newUser)
        document.querySelector('.newPlayers').innerHTML += `<div>Player${newUser.id}: ${newUser.name}</div>`
        document.querySelector('.submitTeeBox').style.display = "block"
        document.querySelector('.table').innerHTML += `<tr class= "player${newUser.id}score-sheet"><th>${newUser.name}</th><td class="firstHoleScore" ></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`
        document.querySelector('.players').innerHTML += `<div class="player${newUser.id}">${newUser.name} <input id="player${newUser.id}score" maxlength="3" type="number"></div>`
        popupWindow.style.display = "none"
        document.querySelector('.newPlayers').style.display = "flex"

        document.querySelector('.newPlayerName').value = " "
    }
    else{
        alert('Please Fill Your Name Before You Continue')
    }


    if(newUser.id === 4 ){
        playerLimit = true
    }

}






