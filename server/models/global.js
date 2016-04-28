// Load required packages
var mongoose = require('mongoose');
var unique = require('mongoose-unique-validator');

// Define our beer schema
var SceneSchema = new mongoose.Schema({
    userName: {type: String, required: true, unique: true},//the username of the currentUser
    scenes: [String]// - [String] - The _id fields of the all the scenes this user has
});

// Export the Mongoose model
SceneSchema.plugin(unique);
module.exports = mongoose.model('Scene', SceneSchema);
