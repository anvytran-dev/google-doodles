//current date
let current = new Date(Date());
//min and max years --parameters
let minYear = 1998;
let maxYear = new Date(Date()).getFullYear();

//h1
let title = document.querySelector('h1');
//date elements
let currentDateElement = document.querySelector('.currentDate');
let inputDate = document.querySelector('#inputDate');
//buttons
let pastButton = document.querySelector('.pastButton');
let futureButton = document.querySelector('.futureButton');
let getDoodlesButton = document.querySelector('#getDoodlesButton');

//event listeners on buttons
currentDateElement.addEventListener('mouseenter', changeToInput);
inputDate.addEventListener('mouseout', changeToDateString)
pastButton.addEventListener('click', getPastDoodle);
futureButton.addEventListener('click', getFutureDoodle);
getDoodlesButton.addEventListener('click', getDoodlesFromInput)


function randomColor(){
    let randomColor = Math.random();

    if (randomColor <= 0.25) {
        randomColor = 'red';
    } else if (randomColor <= 0.50) {
        randomColor = 'orange';
    } else if (randomColor <= 0.75) {
        randomColor = 'green';
    } else {
        randomColor = 'blue';
    }
    return randomColor;
}


function changeColor(e) {
    let btn = e.target
    
    let color = randomColor();

    // switch(randomColor) {
    //     case (randomColor <= 0.25): randomColor = 'green';
    //     break;
    //     case (randomColor <= 0.50): randomColor = 'red';
    //     break;
    //     case (randomColor <= 0.75): randomColor = 'yellow';
    //     break;
    //     case (randomColor <= 1): randomColor = 'blue';
    //     break;
    // }
   
    btn.style.background = color;
}



function changeToDateString() {
    //reveals
    currentDateElement.classList.remove('d-none');
    pastButton.classList.remove('d-none');
    futureButton.classList.remove('d-none');
    //hides
    inputDate.classList.add('d-none');
    getDoodlesButton.classList.add('d-none');
}
//called upon refresh
function loadPage() {
    
    loadTitle();
    convertDate(current);

}

function loadTitle() {
    let letters = document.querySelectorAll('.letter');
    letters.forEach(function(letter) {
        letter.style.color = randomColor()
        if(letter.innerHTML== " ") {
            letter.style = "width: 2%";
        }}
    );
}
async function convertDate(currentDate) {
    console.log(currentDate)
    //get current date
    let currentDateDay = currentDate.getDate();
    console.log(currentDateDay)
    let currentMonthNum = currentDate.getMonth();
    let currentMonthString = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    console.log(currentDate, currentMonthString, currentDateDay, currentYear);

    currentMonthNum = currentMonthNum + 1
    currentMonthString = convertMonthToString(currentMonthNum);
    //print date to DOM
    currentDateElement.innerHTML = `${currentMonthString} ${currentDateDay} ${currentYear}`;

    //input bar "yyyy-MM-dd"
    if (currentMonthNum < 10) {
        currentMonthNum = `0${currentMonthNum}`
    }
    if (currentDateDay < 10) {
        currentDateDay = `0${currentDateDay}`
    }

    document.querySelector('#inputDate').value = `${currentYear}-${currentMonthNum}-${currentDateDay}`;

    //fetch google doodle
    
    await fetchDoodle(currentYear, currentMonthNum, currentDateDay);


}

//fetches doodles and creates cards
async function fetchDoodle(year, month, day) {


    //create div
    let div = document.createElement('div');
    div.classList.add('doodles', 'd-flex', 'flex-wrap', 'justify-content-between');
    div.id = 'doodlesCardDiv';
    document.querySelector('.divDoodles').append(div);

    //loop to fetch each image from the API
    let doodleDiv = document.querySelector('.doodles')
    for (let i = maxYear; i > minYear + 1; i--) {

        let url = `https://google-doodles.herokuapp.com/doodles/${i}/${month}?hl=en`

        let response = await fetch(url);
        let data = await response.json();
        
        for (let i = 0; i < data.length; i++) {

            if (data[i].run_date_array[2] == day) {

                //create card
                let doodle = document.createElement('section');
                doodle.classList.add('card');
                doodle.style = 'height: 20rem';
                doodle.style = 'width: 33%';

                doodleDiv.append(doodle);

                //create img and add img
                let img = document.createElement('img');
                img.classList.add('card-img-top');
                img.style = 'height: 150px';
                img.setAttribute('src', data[i].url);
                doodle.append(img);

                //append card-body
                let div = document.createElement('div');
                div.className = 'card-body';
                doodle.append(div);

                //create title and add title
                let h2 = document.createElement('h2');
                h2.classList.add('title');
                h2.innerHTML = data[i].title;
                div.append(h2);
                console.log()

                //create date and add date
                let h3 = document.createElement('h3');
                h3.classList.add('date');
                let date = data[i].run_date_array[2];
                let month = data[i].run_date_array[1];
                let year = data[i].run_date_array[0];
                month = convertMonthToString(month);
                h3.innerHTML = `${month} ${date} ${year}`;
                div.append(h3);

                //button
                let button = document.createElement('button');
                button.classList.add('btn');
                button.innerHTML = 'Whats in the the doodle';
                button.style.background = randomColor();
                div.append(button);
                button.addEventListener('click', redirectToSearch)

                // https://www.google.com/search?q=Children%27s%20Day%202019%20(Thailand)%20January%2012%202019
                //creating re-direct query after the user clicks on the button
                let dateArray = [month, day, year]
                let holiday = data[i].title.split(" ").concat(dateArray);

                let query = "";

                for (let i = 0; i < holiday.length; i++) {
                    if (i == holiday.length - 1) {
                        query += `20${holiday[i]}`
                    } else if (i == 0) {
                        query += `${holiday[i]}%`
                    } else {
                        query += `20${holiday[i]}%`
                    }
                }

                let redirectUrl = `https://www.google.com/search?q=${query}`;

                //redirect to google search
                function redirectToSearch() {
                    window.open(redirectUrl);
                }
            }
        }
    }
    let buttons = document.querySelectorAll('button');
    buttons.forEach(btn => btn.addEventListener('mouseenter', changeColor))
}

function convertMonthToString(currentMonthString) {
    switch (currentMonthString) {
        case 1: currentMonthString = 'January';
            break;
        case 2: currentMonthString = 'February';
            break;
        case 3: currentMonthString = 'March';
            break;
        case 4: currentMonthString = 'April';
            break;
        case 5: currentMonthString = 'May';
            break;
        case 6: currentMonthString = 'June';
            break;
        case 7: currentMonthString = 'July';
            break;
        case 8: currentMonthString = 'August';
            break;
        case 9: currentMonthString = 'September';
            break;
        case 10: currentMonthString = 'October';
            break;
        case 11: currentMonthString = 'November';
            break;
        case 12: currentMonthString = 'December';
            break;
    }
    return currentMonthString;
}

function getDoodlesFromInput() {

    clearCards();

    //convert date
    let valDate = inputDate.value;//2021-11-18
   
    let valArray = valDate.split("-");
    let valYear = valArray[0];
    let valMonth = Number(valArray[1]);
    let valDay = Number(valArray[2]);


    if (valMonth < 10) {
        valMonth = `0${valMonth}`
    }
    if (valDay < 10) {
        valDay = `0${valDay}`
    }

    valDate = new Date(`${valYear}-${valMonth}-${valDay}T12:00:00`);
  
    convertDate(valDate);

}

function changeToInput() {
    //hides
    currentDateElement.classList.add('d-none');
    pastButton.classList.add('d-none');
    futureButton.classList.add('d-none');
    //reveals
    inputDate.classList.remove('d-none');
    getDoodlesButton.classList.remove('d-none');

}


function getPastDoodle() {

    clearCards();

    let oneDayAgo = new Date(current.setDate(current.getDate() - 1));
    current = oneDayAgo;

    convertDate(current);
}

function getFutureDoodle() {

    clearCards();

    let oneDayFuture = new Date(current.setDate(current.getDate() + 1));
    current = oneDayFuture;

    convertDate(current);
}

function clearCards() {
    document.getElementById('doodlesCardDiv').remove();
}





loadPage();