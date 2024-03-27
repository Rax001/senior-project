console.log(`Welcome to Food Oracle!`);

const queryInput = document.getElementById('inputLookUp');
const queryButton = document.getElementById('queryButton');
queryButton.onclick = function() {
    queryDB(queryInput.value);
} 
    

let dataWrapper = document.getElementById('displayFromServer');

function queryDB(foodName) {
    if (foodName == "") {
        return;
    }
    console.log('requesting info for:', foodName);

    fetch('http://binary141.com:8080/'+ foodName)
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Response was not ok');
        }
        return response.text();
    })
    .then(function(data) {
        console.log(data);
        dataWrapper.innerHTML = data;
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
//         dataWrapper.innerHTML = data;
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
//         let dataWrapper = document.getElementById('displayFromServer');
//         dataWrapper.innerHTML = data;
//     })


    // https://world.openfoodfacts.net/api/v2/product/028000772123?fields=product_name,nutriments

    

    // https://world.openfoodfacts.org/cgi/search.pl?search_terms=hot+cheetos&search_simple=1&action=process