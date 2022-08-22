const mongoose = require('mongoose');


const databaseURL = "mongodb+srv://abhidilli:WauOXsA2vcSBiiv2@cluster0.zl6v7.mongodb.net/?retryWrites=true&w=majority"


mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.....')
    } else {
        console.log('Error in DB connection: ' + err)

    }
});