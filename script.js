let courseOptionsHtml = '';
let golfCourseId = '';
let currentCourseInfo = '';
let currentCourse = '';
let currentHole = 0;
let currentTeeBox = '';
let TeeBoxArr = [];
let teeBoxValue = 0;


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
}

async function displayCourseInfo() {
    currentCourseInfo = await getCourseInfo();
    let currentHoleCounter = 1
    let currentHolesHtml = ''
    let currentYard = ''
    let currentPar = ''
    let currentHandicap = ''

    currentCourseInfo.holes.forEach(elm => {
        currentHolesHtml += `<td>${currentHoleCounter}</td>`
        currentHoleCounter++
    })
    for (let i =0; i < currentCourseInfo.holes.length; i++){
        console.log(currentCourseInfo.holes[i].teeBoxes[teeBoxValue].yards)
        currentYard += `<td>${currentCourseInfo.holes[i].teeBoxes[teeBoxValue].yards}</td>`
        currentPar += `<td>${currentCourseInfo.holes[i].teeBoxes[teeBoxValue].par}</td>`
        currentHandicap += `<td>${currentCourseInfo.holes[i].teeBoxes[teeBoxValue].hcp}</td>`
    }

    let currentHolesTable = `<tr>${currentHolesHtml}</tr>`
    document.querySelector('.holesRow').innerHTML = '<th>Holes</th>' + currentHolesTable
    document.querySelector('.yardageRow').innerHTML = '<th>Yardage</th>' + currentYard
    document.querySelector('.parRow').innerHTML = '<th>Par</th>' + currentPar
    document.querySelector('.handicapRow').innerHTML = '<th>Handicap</th>' + currentHandicap

}


function displayPopup (){
    var popupWindow = document.querySelector('.popupWindow');
    var popupButton = document.querySelector('.addNewUser');
    var closePopup = document.querySelector('.closeButton');
    popupWindow.style.display = "block"
    document.querySelector('.container').opacity = "50%"
}

function closePopup (){
    var popupWindow = document.querySelector('.popupWindow');
    var popupButton = document.querySelector('.addNewUser');
    var closePopup = document.querySelector('.closeButton');
    popupWindow.style.display = "none"
}


class Player {
    constructor(name, id = getNextId(), scores = []) {
      this.name = name;
      this.id = id;
      this.scores = scores;
    }
  }


