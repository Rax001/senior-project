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

// fetch('http://binary141.com:8080/hotcheetos')
//     .then(function(response) {
//         if (!response.ok) {
//             throw new Error('Response was not ok');
//         }
//         return response.text();
//     })
//     .then (function(data) {
//         console.log(data);
//         mongoData.innerHTML = data;
//     })


// fetch('https://world.openfoodfacts.net/api/v2/product/066022003283?fields=product_name,nutriments')
//     .then(function(response) {
//         if (!response.ok) {
//             throw new Error('Response was not ok');
//         }
//         return response.text();
//     })
//     .then (function(data) {
//         console.log(data);
//         let mongoData = document.getElementById('displayFromServer');
//         mongoData.innerHTML = data;
//     })


    // https://world.openfoodfacts.net/api/v2/product/028000772123?fields=product_name,nutriments

    

    // https://world.openfoodfacts.org/cgi/search.pl?search_terms=hot+cheetos&search_simple=1&action=process