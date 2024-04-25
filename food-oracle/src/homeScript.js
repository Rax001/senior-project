console.log(`Welcome to Food Oracle!`); 

queryDayTotals();

let calorieDayTotal = document.getElementById('totalCals');

let carbCals = document.getElementById('carbCals');
let fatCals = document.getElementById('fatCals');
let proteinCals = document.getElementById('proteinCals');

let carbDayTotal = document.getElementById('carbGrams');
let fatDayTotal = document.getElementById('fatGrams');
let proteinDayTotal = document.getElementById('proteinGrams');


function queryDayTotals() {
    fetch('http://127.0.0.1:8080/dietLog/dayTotals')
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Response was not ok');
        }
        return response.json();
    })
    .then (function(data) {
        console.log(data);
        calorieDayTotal.innerHTML = data[0].Calories;

        carbCals.innerHTML = (data[0].Carbs * 4).toFixed(1);
        fatCals.innerHTML = (data[0].Fats * 9).toFixed(1);
        proteinCals.innerHTML = (data[0].Proteins * 4).toFixed(1);

        carbDayTotal.innerHTML = data[0].Carbs;
        fatDayTotal.innerHTML = data[0].Fats;
        proteinDayTotal.innerHTML = data[0].Proteins;
    })
}

function queryEntireLog() {
    fetch('http://127.0.0.1:8080/dietLog')
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Response was not ok');
        }
    })
    .then (function(data) {
        console.log(data);
        // create a for loop to display each piece of the dietLog
    })
}

