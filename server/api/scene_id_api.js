/**
 * This file is the scene_id api.
 * It is called when encourtering the format: /scene/:sceneid
 * It has a get function.
 * @type {*|exports|module.exports}
 */

var Scene = require('./../models/scene.js');


module.exports = function (SceneRouteID) {

    /**
     * SceneID's get function will return the get to the front end, containing everything a user has
     * All the scenes will be returned immediately.
     */
    SceneRouteID
        .get(function (req, res) {
            Scene.find({session: req.params.session}, function (err, task) {
                if (err || task == null) {
                    res.status(404).json({
                        "message": "Failed: task doesn't exist",
                        data: []
                    });
                    return
                }

                res.status(200).json({
                    "message": "Success, task return",
                    "data": task
                });

            })
        });


};