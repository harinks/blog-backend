const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose
        .connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("database connected", process.env.DB_Name);
        });
};

module.exports = connectDatabase;