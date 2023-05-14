const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const gatewaySchema = new Schema({
    serialNumber: {type: String, unique: true, required: true},
    fullName: {type: String, default: 'No name'},
    ipv4Address: {type: String, unique: true, required: [true, 'Need to be validated']},
    devices: [{type: Schema.Types.ObjectId, ref: 'Device'}]
});

gatewaySchema.plugin(uniqueValidator, {message: 'The {PATH} most be unique'});
module.exports = mongoose.model('Gateway', gatewaySchema);