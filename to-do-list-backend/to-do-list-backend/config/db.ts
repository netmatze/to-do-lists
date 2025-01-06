const mongoose = require('mongoose');

function connectDB() {
    const url = "mongodb://localhost:27017/to-do-lists";

    try {
        mongoose.connect(url);
    } catch (err) {
        console.error(err);
    }
    const dbConnection = mongoose.connection;
    dbConnection.once("open", (_) => {
        console.log(`Database connected: ${url}`);
    });

    dbConnection.on("error", (err) => {
        console.error(`connection error: ${err}`);
    });
}

module.exports = connectDB;