console.log(`Now on Food Logging page`);

let currentDate = new Date().toLocaleDateString('en-CA');

queryDayTotals();
queryEntireLog();

const queryInput = document.getElementById('inputLookUp');
const queryButton = document.getElementById('queryButton');
queryButton.onclick = function() {
    queryDB(queryInput.value);
}

let msgContainer = document.getElementById('messageContainer');
let msgStatus = document.querySelector('p');
let toUserMsg = document.getElementById('userMessage');
let loadAnimation = document.getElementById('loadingAnimation');

const manualButton = document.getElementById('manualButton');
manualButton.onclick = () => {
    console.log('manual clicked');
    toggleManual();
}

let nameInput = document.getElementById('nameInput');
let quantityInput = document.getElementById('quantityInput');
let caloriesInput = document.getElementById('caloriesInput');
let carbsInput = document.getElementById('carbsInput');
let fatInput = document.getElementById('fatInput');
let proteinInput = document.getElementById('proteinInput');

let carbs100; let fat100; let protein100;

function queryDB(foodName) {
    if (foodName == "") {
        return;
    }
    console.log('requesting info for:', foodName);
    msgStatus.innerHTML = 'Query: ';
    msgStatus.style.color = '#22c3ff'
    toUserMsg.innerHTML = `Searching for ${foodName}`;
    loadAnimation.style.display = 'block';
    startAnimation();
    msgContainer.style.display = 'flex';
    fetch('http://binary141.com:8080/'+ foodName)
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Response was not ok');
        }
        return response.json();
    })
    .then(function(data) {
        // console.log(data);
        msgContainer.style.display = 'none';
        loadAnimation.style.display = 'none';
        toUserMsg.innerHTML = '';
        msgStatus.innerHTML = '';
        if (data.length != 0) {

            nameInput.value = data[0].product_name;
            quantityInput.value = 100;
            
            carbsInput.value = (data[0].nutriments[0].carbohydrates).toFixed(1);
            fatInput.value = (data[0].nutriments[0].fat).toFixed(1);
            proteinInput.value = (data[0].nutriments[0].proteins).toFixed(1);
    
            caloriesInput.value = ((carbsInput.value * 4) + (fatInput.value * 9) + (proteinInput.value * 4)).toFixed(1);

            carbs100 = carbsInput.value;
            fat100 = fatInput.value;
            protein100 = proteinInput.value;
        } else {
            msgStatus.innerHTML = 'Error: ';
            msgStatus.style.color = 'red';
            toUserMsg.innerHTML = 'No data found. Enter info manually or search a different food'
            msgContainer.style.display = 'flex';
            setTimeout(function() {
            msgContainer.style.display = 'none';
            toUserMsg.innerHTML = '';
            msgStatus.innerHTML = '';
            }, 5000);
        }
    })
}

let intervalId;
function startAnimation() {
    clearInterval(intervalId);
    loadAnimation.textContent = '';
    intervalId = setInterval(function() {
        if (loadAnimation.textContent.length == 3) {
            loadAnimation.textContent = '';
        }
       loadAnimation.appendChild(document.createTextNode('.'));
    }, 950);
}


quantityInput.addEventListener('input',function() {
    proteinInput.value = (quantityInput.value * (protein100 / 100)).toFixed(1);
    fatInput.value = (quantityInput.value * (fat100 / 100)).toFixed(1);
    carbsInput.value = (quantityInput.value * (carbs100 / 100)).toFixed(1);
    caloriesInput.value = ((carbsInput.value * 4) + (fatInput.value * 9) + (proteinInput.value * 4)).toFixed(1);
})


let calorieDayTotal = document.getElementById('logTotalCals');

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
        // console.log(data[0]);
        calorieDayTotal.innerHTML = (data[0].Calories).toFixed(1);
        carbDayTotal.innerHTML = (data[0].Carbs).toFixed(1);
        fatDayTotal.innerHTML = (data[0].Fats).toFixed(1);
        proteinDayTotal.innerHTML = (data[0].Proteins).toFixed(1);
    })
}

let section = document.getElementById('mongoDataWrapper');
let inputs = section.querySelectorAll('input');

let logFoodButton = document.getElementById('logFoodButton');
logFoodButton.onclick = () => {
    let isComplete = true;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value.trim() === '') {
            isComplete = false;
        }
    }
    if (isComplete) {
        addToDietLog(nameInput.value, quantityInput.value, caloriesInput.value, carbsInput.value, fatInput.value, proteinInput.value);
        queryDayTotals();
        querySingleDayDiet(currentDate);
    } else {
        msgStatus.innerHTML = 'Error: ';
        msgStatus.style.color = 'red';
        toUserMsg.innerHTML = 'Must fill out all fields before logging food'
        msgContainer.style.display = 'flex';
        setTimeout(function() {
            msgContainer.style.display = 'none';
            toUserMsg.innerHTML = '';
            msgStatus.innerHTML = '';
        }, 5000);
    }
}

function addToDietLog(name, amount, calories, carbs, fats, proteins) {
    console.log("recording food...")
    const units = 'g';
    // const currentDate = new Date().toLocaleDateString('en-CA');
    fetch('http://127.0.0.1:8080/dietLog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            quantity: amount,
            unit: units,
            calories: calories,
            carbohydrates: carbs,
            fats: fats,
            proteins: proteins, 
            date: currentDate
        })
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Response was not ok');
        }
    })
    .then(function(data) {
        console.log(data);
    })
}

const dietLog = document.getElementById('displayDietLog');

function generateDietLog(food) {
    // console.log(food.name);

    let dataRow = document.createElement('div');
    dataRow.id = 'dataRow'+ food.id;
    dataRow.className = 'data-member';

    let nameQuantityBox = document.createElement('div');
    nameQuantityBox.className = 'name-quantity-box';

    let dataDate = document.createElement('div');
    dataDate.id = 'dataDate';
    dataDate.innerHTML = food.date;
    nameQuantityBox.appendChild(dataDate);

    let dataName = document.createElement('input');
    dataName.classList.add('nq-data', 'dataName');
    dataName.value = food.name;
    dataName.readOnly = true;
    nameQuantityBox.appendChild(dataName);

    let dataQUContainer = document.createElement('div');
    dataQUContainer.className = 'quantity-unit-container';

    let dataQuantity = document.createElement('input');
    dataQuantity.classList.add('nq-data', 'dataQuantity');
    dataQuantity.value = food.quantity;
    dataQuantity.readOnly = true;
    dataQUContainer.appendChild(dataQuantity);

    let dataUnit = document.createElement('div');
    dataUnit.className = 'data-label';
    dataUnit.innerHTML = 'g';
    dataQUContainer.appendChild(dataUnit);

    
    nameQuantityBox.appendChild(dataQUContainer);
    
    dataRow.appendChild(nameQuantityBox);

    let calMacrosBox = document.createElement('div');
    calMacrosBox.className = 'cal-macros-box';

    let calorieGrid = document.createElement('div');
    calorieGrid.className = 'gridObject';
    let dataCalories = document.createElement('input');
    dataCalories.id = 'dataCalories';
    dataCalories.value = food.calories;
    dataCalories.readOnly = true;
    calorieGrid.appendChild(dataCalories);
    let dataCalLabel = document.createElement('div');
    dataCalLabel.className = 'data-label';
    dataCalLabel.innerHTML = 'Calories';
    calorieGrid.appendChild(dataCalLabel);
    calMacrosBox.appendChild(calorieGrid);

    let carbGrid = document.createElement('div');
    carbGrid.className = 'gridObject';
    let dataCarbs = document.createElement('input');
    dataCarbs.id = 'dataCarbs';
    dataCarbs.value = food.carbohydrates;
    dataCarbs.readOnly = true;
    carbGrid.appendChild(dataCarbs);
    let dataCarbLabel = document.createElement('div');
    dataCarbLabel.className = 'data-label';
    dataCarbLabel.innerHTML = 'Carbohydrate(g)';
    carbGrid.appendChild(dataCarbLabel);
    calMacrosBox.appendChild(carbGrid);

    let fatGrid = document.createElement('div');
    fatGrid.className = 'gridObject';
    let dataFats = document.createElement('input');
    dataFats.id = 'dataFats';
    dataFats.value = food.fats;
    dataFats.readOnly = true;
    fatGrid.appendChild(dataFats);
    let dataFatLabel = document.createElement('div');
    dataFatLabel.className = 'data-label';
    dataFatLabel.innerHTML = 'Fat(g)';
    fatGrid.appendChild(dataFatLabel);
    calMacrosBox.appendChild(fatGrid);
    
    let proteinGrid = document.createElement('div');
    proteinGrid.className = 'gridObject';
    let dataProtein = document.createElement('input');
    dataProtein.id = 'dataProtein';
    dataProtein.value = food.proteins;
    dataProtein.readOnly = true;
    proteinGrid.appendChild(dataProtein);
    let dataProteinLabel = document.createElement('div');
    dataProteinLabel.className = 'data-label';
    dataProteinLabel.innerHTML = 'Protein(g)';
    proteinGrid.appendChild(dataProteinLabel);
    calMacrosBox.appendChild(proteinGrid);

    dataRow.appendChild(calMacrosBox);  
    
    dietLog.appendChild(dataRow);
    
    let hzLine = document.createElement('hr');
    dietLog.appendChild(hzLine);

    let editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.onclick = () => {
        let buttons = document.querySelectorAll('.name-quantity-box button');

        for (let button of buttons) {
            if (button.innerHTML == 'Save' && button != editButton) {
                return;
            }
        }

        let goodInput = true;

        if (editButton.innerHTML == 'Edit') {
            editButton.innerHTML = 'Save';

            protein100 = dataProtein.value * (100 / dataQuantity.value);
            fat100 = dataFats.value * (100 / dataQuantity.value);
            carbs100 = dataCarbs.value * (100 / dataQuantity.value); 
            
            dataName.readOnly = false;
            dataQuantity.readOnly = false;
            dataCalories.readOnly = false;
            dataCarbs.readOnly = false;
            dataFats.readOnly = false;
            dataProtein.readOnly = false;

            dataName.focus();
        } else {
            let target;
            let dataInputs = dataRow.querySelectorAll('input');

            for (let input of dataInputs) {
                if (input.value.trim() == '') {
                    goodInput = false;
                    target = input;
                }
            }

            if (goodInput) {
                editButton.innerHTML = 'Edit';
                
                editFoodData(food.id, dataName.value, dataQuantity.value, dataCalories.value, dataCarbs.value, dataFats.value, dataProtein.value);

                dataName.readOnly = true;
                dataQuantity.readOnly = true;
                dataCalories.readOnly = true;
                dataCarbs.readOnly = true;
                dataFats.readOnly = true;
                dataProtein.readOnly = true;
            } else {
                target.focus();
            }           
        }
    }
    nameQuantityBox.appendChild(editButton);

    dataQuantity.oninput = () => {
        dataProtein.value = (dataQuantity.value * (protein100 / 100)).toFixed(1);
        dataFats.value = (dataQuantity.value * (fat100 / 100)).toFixed(1);
        dataCarbs.value = (dataQuantity.value * (carbs100 / 100)).toFixed(1);
        dataCalories.value = ((dataCarbs.value * 4) + (dataFats.value * 9) + (dataProtein.value * 4)).toFixed(1);
    }

    let deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.onclick = () => {
        if (confirm("Are you sure you want to delete this item?")) {
            deleteFoodData(food.id);
        }
    }
    calMacrosBox.appendChild(deleteButton);
}

function editFoodData(id, name, quantity, calories, carbs, fats, protein) {
    fetch(`http:127.0.0.1:8080/dietLog/edit`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            name: name,
            quantity: quantity,
            calories: calories,
            carbohydrates: carbs,
            fats: fats,
            proteins: protein
        })
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Response was not ok');
        } else {
            queryEntireLog();
        }
    })
}

function deleteFoodData(food_id) {
    fetch(`http://127.0.0.1:8080/dietLog/delete`, {
        method: "DELETE",
        headers: {
            'Content-Type': "application/json"
        }, 
        body: JSON.stringify({
            id: food_id
        })
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Response was not ok');
        } else {
            queryEntireLog();
        }
    })
}

let todayButton = document.getElementById('todayDataButton');
todayButton.onclick = () => {
    singleDayInput.value = currentDate;
    startDateInput.value = '';
    querySingleDayDiet(currentDate);
}

let singleDayInput = document.getElementById('singleDayInput');
singleDayInput.oninput = () => {
    console.log(singleDayInput.value);
    startDateInput.value = '';
    querySingleDayDiet(singleDayInput.value);
}

function querySingleDayDiet(date) {
    fetch(`http://127.0.0.1:8080/dietLog/singleDay/${date}`)
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Response was not ok');
        }
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        clearDietLogDisplay();
        data.forEach(generateDietLog);
    })
}

let startDateInput = document.getElementById('startDateInput');
startDateInput.oninput = () => {
    console.log('Date selected:', startDateInput.value);
    singleDayInput.value = '';
    queryDateRange(startDateInput.value);
};

function queryDateRange(date) {
    fetch('http://127.0.0.1:8080/'+ date)
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Response was not ok');
        }
        return response.json();
    })
    .then (function(data) {
        console.log(data);
        clearDietLogDisplay();
        data.forEach(generateDietLog);
    })
}

let allDataButton = document.getElementById('allDataButton');
allDataButton.onclick = () => {
    startDateInput.value = '';
    singleDayInput.value = '';
    queryEntireLog();
}

function queryEntireLog() {
    fetch('http://127.0.0.1:8080/dietLog')
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Response was not ok');
        }
        return response.json();
    })
    .then (function(data) {
        console.log(data);
        clearDietLogDisplay();
        data.forEach(generateDietLog);
            
    });
}

function clearDietLogDisplay() {
    dietLog.innerHTML = '';
}

function toggleManual() {
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].id != 'quantityInput') {
            if (inputs[i].hasAttribute('readonly')) {
                inputs[i].removeAttribute('readonly');
                inputs[i].removeAttribute('tabindex');
            } else {
                inputs[i].setAttribute('readonly', 'readonly');
                inputs[i].setAttribute('tabindex', '-1');
            }
        }
    }
}