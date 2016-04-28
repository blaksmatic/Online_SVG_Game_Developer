// Load required packages
var mongoose = require('mongoose');
var unique = require('mongoose-unique-validator');

// Define our beer schema
var SceneSchema = new mongoose.Schema({
    session: {type: String, required: true},
    scene_id: {type: Number, required: true, unique: true},//the ids of the scene
    name: {type: String, required: true}, //the name of the scene
    conversation: {type: String},
    choice_name: {type: String},
    next: {type: String},
    choices: [String],// - [String] - The _id fields of the next scenes
    background_image: {type: String},
    character_img: {type: String}
});

// Export the Mongoose model
SceneSchema.plugin(unique);
module.exports = mongoose.model('Scene', SceneSchema);
