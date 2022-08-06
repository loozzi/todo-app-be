const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const User = new Schema({
    username: { type: String },
    password: { type: String },
    email: { type: String },
    create_at: { type: Date, default: Date.now },
    amount: { type: Number, default: 0 },
    role: {type: Number, default: 0}
});


const UserModel = mongoose.model('user', User);
module.exports = UserModel;