// Load required packages
var mongoose = require('mongoose');
var unique = require('mongoose-unique-validator');

// Define our beer schema
var StatusSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    value: {type: String, required: true}
});

// Export the Mongoose model
StatusSchema.plugin(unique);
module.exports = mongoose.model('Status', StatusSchema);
