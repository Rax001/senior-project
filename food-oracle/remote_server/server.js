const mongoose = require('mongoose');


// import express
const express = require('express');

// create new express app and save it as "app"
const app = express();

// server configuration
const PORT = 8080;

// connect to MongoDB
mongoose.connect(`mongodb://127.0.0.1:27017/off`).then(function() {
    console.log('Database is connected successfully.');
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const foodSchema = new mongoose.Schema({
    product_name : String,
    nutriments: [{ carbohydrates: Number, proteins: Number, fat: Number}]
})

foodSchema.index({product_name: 1, nutriments: -1});

const foodModel = mongoose.model('products', foodSchema);

// foodModel.schema.indexes().forEach(index => {
//     console.log('Index:', index);
// });

// create a route for the app
app.get('/:endpoint', (req, res) => {
    const item = req.params.endpoint;
    console.log('querying, fetching data for:', item);
    foodModel.find({product_name: {$regex: item, $options: 'i'}, "nutriments.carbohydrates": {$gte: 0}, "nutriments.proteins": {$gte: 0}, "nutriments.fat": {$gte: 0}}, {product_name: 1, "nutriments.carbohydrates": 1, "nutriments.proteins": 1, "nutriments.fat": 1, _id: 1 }).limit(1).then(function(data) {
        res.json(data);
    })
    // res.send('Holy moly, it worked');
});

// make the server listen to requests
app.listen(PORT, () => {
    console.log(`Server running at: http://binary141.com:${PORT}/`);
});


// "nutriments.carbohydrates": 1, "nutriments.proteins": 1, "nutriments.fat": 1,