const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadhotelsSchema = Schema({
    step: Number,
    name: String,
    email: String,
    contact: Number,
    rooms: Number,
    price: Number,
    address: {String},
    checkboxValue: [String],
    imagePaths: [String],
     

});

module.exports = mongoose.model('ListRequest', uploadhotelsSchema);

