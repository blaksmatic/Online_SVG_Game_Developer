/**
 * This file is the scene api, where the scene's post and delete
 * functions are defined.
 * @type {*|exports|module.exports}
 */

var Scene = require('./../models/scene.js');

module.exports = function (SceneRoute) {

    /**
     * Scene's post function where a new scene is creates or is overwritten
     * by the scene with the same ID.
     */
    SceneRoute
        .post(function (req, res) {
            Scene.update({"scene_id": req.body.scene_id}, req.body, {upsert: true}, function (err, data) {
                //console.log(data);
                res.status(200).send("");
            })
        })

        /**
         * The delete function where a scene is deleted.
         */
        .delete(function (req, res) {
            //console.log(req.body);
            Scene.find({scene_id: req.body.scene_id}).remove().exec();
            res.status(200).send("");
        });

};