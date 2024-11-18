const mongoose = require('mongoose');

const dbConnection = async ()=>{
try {
    mongoose.connect(process.env.DB_HOST+process.env.DATABASE_NAME).then(console.log(`Your ${process.env.DATABASE_NAME} database connected successfully. `));
} catch (error) {
    console.log(`ERROR from DataBase Connection : ${error}`);
}
}

module.exports = {dbConnection};