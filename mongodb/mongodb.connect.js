const mongoose = require('mongoose');

const mongoUri = 'mongodb://localhost:27017/todo-tdd';
async function connect(){
    try {
        
        // connect to mongoDB
        await mongoose.connect(mongoUri)
    } catch (error) {
       console.error('error connecting to the mongodb');
       console.error(error) 
    }
}

module.exports = {connect}