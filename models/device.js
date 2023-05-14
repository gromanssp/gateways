const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    uid: {type: Number, require: true, unique: true},
    vendor: {type: String, required: [true, 'The vendor is required']},
    date: {type: Date, default: Date.now},
    status: {type: String, enum: ['online', 'offline'], default: 'offline'}
});

deviceSchema.plugin(uniqueValidator, {message: 'The {PATH} most be unique'});
module.exports = mongoose.model('Device', deviceSchema);