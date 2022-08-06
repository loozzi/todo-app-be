const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://loozzi_myapp:pI5NCGIey19ga1nK@cluster0.hqs96.mongodb.net/my_app1');
        console.log('Connect to MongoDB success....');
    } catch (error) {
        console.log('Connect to MongoDB fail....');
    }
}


module.exports = {
    connect
}