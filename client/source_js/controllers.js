var MainControllers = angular.module('MainControllers', []);

MainControllers.controller('mainController', ['$scope', 'CommonData', '$http', 'TaskService', function ($scope, CommonData, $http, TaskService) {
    $scope.preview_img = "http://mysmartdunia.com/wp-content/uploads/2016/01/preview.png";
    $scope.all_scenes = [];

    //basic information
    $scope.session = "";
    $scope.background_img = "";
    $scope.character_img = "";
    $scope.name = "";
    $scope.scene_id = "";
    $scope.choice_name = "";
    $scope.conversation = "Input Something.";
    $scope.next = "";
    $scope.choices = "";

    //conversation
    $scope.conversation_index = 0;
    $scope.conversation_show = "";

    //show status
    $scope.status_show = true;
    $scope.show_choices = false;
    $scope.show_panel = true;

    var ani_library = ["fadeInUp", "bounce", "tada", "flash", "bounceOut", "fadeInLeftBig", "fadeInLeft", "fadeInRight",
        "fadeInRightBig", "zoomOutRight", "zoomOutLeft", "rotateIn", "lightSpeedIn"];

    /**
     * Get the scene with a specific scene number. Simply interate the scenes.
     * @param scene_id
     * @returns {*}
     */
    function get_scene(scene_id) {
        for (var i = 0; i < $scope.all_scenes.length; i++) {
            if ($scope.all_scenes[i].scene_id.toString().localeCompare(scene_id) == 0) {
                return $scope.all_scenes[i];
            }
        }
    }

    function has_scene(scene_id) {
        for (var i = 0; i < $scope.all_scenes.length; i++) {
            if ($scope.all_scenes[i].scene_id.toString().localeCompare(scene_id) == 0) {
                return true;
            }
        }
        return false;
    }

    function get_next_scene_ids(scene_id) {
        scene = get_scene(scene_id);
        to_return = [];
        if (!scene)
            return to_return;
        if (scene.next != "")
            to_return.push(scene.next);
        if (scene.choices.length != 0) {
            // console.log("chioces : " + scene.choices.toString());
            to_return = to_return.concat(scene.choices);
        }
        console.log("toreturn : " + to_return.toString());
        return to_return;
    }

    /**
     * Delete a scene using delete service from server. It will delete a scene with a specific scene id.
     */
    $scope.delete_scene = function () {
        TaskService.delete_service('/scene', {"scene_id": $scope.scene_id}, $scope.get_all_from_user());
    };


    /**
     * Go to the next scene with the next scene's ID
     */
    $scope.goto_next_scene = function () {
        $scope.set_current(get_scene($scope.next));
    };

    /**
     * Go to a choice with choice's id.
     * @param choice
     */
    $scope.goto_choice = function (choice) {
        $scope.set_current(choice);
    };

    /**
     * Create a scene and push it to the server.
     */
    $scope.create_scene = function () {
        var new_scene = {
            session: $scope.session,
            background_image: $scope.background_img,
            scene_id: $scope.scene_id,
            name: $scope.name,
            choice_name: $scope.choice_name,
            conversation: $scope.conversation,
            next: $scope.next,
            character_img: $scope.character_img,
            choices: $scope.choices.toString().split(",")
        };

        $scope.send_to_server(new_scene, function () {
        })
    };

    /**
     * Submit the conversation and tranform it into several sentences.
     * Then make it ready for the display
     */
    $scope.submit_conv = function () {
        $scope.conversation_edited = $scope.conversation.toString().split("<p>");
        $scope.conversation_index = 0;
        $scope.conversation_show = $scope.conversation_edited[0];
        if (!$scope.choices_edited) {
            $scope.choices_edited = [];
        }
        $('#conversationID').animo({animation: "fadeInUp", duration: 0.5, keep: false}, function () {
        })
    };


    /**
     * Set the current scene to a scene object, and BTW save all the choices to the choice_edited.
     * choice_edited is the element that stores all the choices scenes.
     *
     * Get all choices and transform them into a list of array.
     * These are choice names that will be displayed on the button.
     * @param scene
     */
    $scope.set_current = function (scene) {

        $scope.background_img = scene.background_image;
        $scope.name = scene.name;
        $scope.scene_id = scene.scene_id;
        $scope.choice_name = scene.choice_name;
        $scope.conversation = scene.conversation;
        $scope.conversation_edited = scene.conversation.toString().split("<P>");
        $scope.next = scene.next;
        if ($scope.character_img != scene.character_img) {
            $scope.character_img = scene.character_img;
            $('#characterID').animo({animation: "fadeInLeft", duration: 0.2, keep: false}, function () {
            });
        }
        $scope.choices = scene.choices.toString();
        $scope.choices_edited = [];
        for (var i = 0; i < $scope.all_scenes.length; i++) {
            for (var j = 0; j < $scope.choices.split(",").length; j++) {
                if ($scope.choices.split(",")[j].toString().localeCompare($scope.all_scenes[i].scene_id.toString()) == 0) {
                    $scope.choices_edited.push($scope.all_scenes[i]);
                }
            }
        }
        $scope.submit_conv();
    };

    /**
     * Send to server the current scene. This also includes updating effect.
     * @param scene
     */
    $scope.send_to_server = function (scene) {
        TaskService.post_service('/scene', scene, function (data, status) {
            $scope.get_all_from_user($scope.session);
        });
    };

    /**
     * Reset the data here to those on the server.
     * @param session
     */
    $scope.get_all_from_user = function () {
        TaskService.get_service('/scene/' + $scope.session, function (data, status) {
            $scope.all_scenes = data;
            create_v(create_json());
            $scope.set_current($scope.all_scenes[0]);
        })
    };


    /**
     * Reset the drag objects
     */
    $scope.drag_reset = function () {
        var $draggable = $('.draggable').draggabilly({
            containment: '.widget_container'
        });
    };

    /**
     * Toggle the status of whether to show the status.
     */
    $scope.toggle_status = function () {
        $scope.status_show = $scope.status_show == false ? true : false;
    };


    /**
     * This function calculates which sentence to show in the next page, and save it into
     * conversation_edited.
     */
    $scope.continue_conv = function () {
        if (!$scope.conversation_edited || $scope.conversation_edited.length === 0) {
            return;
        } else {
            console.log($scope.choices_edited.length);
            if ($scope.conversation_index + 1 == $scope.conversation_edited.length && $scope.choices_edited)
                if ($scope.choices_edited.length == 0) {
                    $scope.goto_next_scene();
                    return;
                }

            //set up the conversation index, and check if the conversation index should be kept the same.
            $scope.conversation_index = $scope.conversation_index + 1 == $scope.conversation_edited.length ?
                $scope.conversation_index : $scope.conversation_index + 1;
            $scope.conversation_show = $scope.conversation_edited[$scope.conversation_index];
            $scope.show_choices = true;
            $scope.show_choices = $scope.conversation_index + 1 == $scope.conversation_edited.length ?
                true : false;
            $('#conversationID').animo({animation: "fadeInUp", duration: 0.2, keep: false}, function () {
            });

            for (var i = 0; i < ani_library.length; i++) {
                var dict = "<conv!" + ani_library[i] + ">";
                if ($scope.conversation_show.indexOf(dict) > -1) {
                    $('#characterID').animo({animation: ani_library[i], duration: 0.5, keep: false}, function () {
                    });
                    $scope.conversation_show.replace(dict, '');
                    $scope.$apply();
                    return;
                }
            }

        }
    };


    $scope.deploy = function () {
        $scope.show_panel = !$scope.show_panel;
        $scope.status_show = false;
    };

    /**
     * Create json function will create json for the current tree structure, and use D3's library to
     * visualize it.
     * @returns {{}|*}
     */
    function create_json() {
        json_file = {};
        var visited = [];
        //console.log($scope.all_scenes);
        json_file["name"] = "start";
        json_file["children"] = [];
        json_file["children"].push(recursive_build($scope.all_scenes[0].scene_id.toString()));
        //console.log(json_file);
        return json_file;

        function recursive_build(scene_id) {
            var new_j = {};
            new_j["name"] = scene_id;
            visited.push(scene_id);

            var next = get_next_scene_ids(scene_id);

            if (next.length == 0) {
                new_j["children"] = null;
            }

            else {
                new_j["children"] = [];
                for (var i = 0; i < next.length; i++) {
                    if (visited.indexOf(next[i]) == -1 && has_scene(next[i]))
                        new_j["children"].push(recursive_build(next[i]));
                }
            }
            //console.log(new_j);
            return new_j;
        }
    }

    /**
     * The following is referred from D3.js tree layout page
     * https://github.com/mbostock/d3/wiki/Tree-Layout
     * http://bl.ocks.org/d3noob/8375092
     * This is the function that creates the tree layout for the nodes.
     * @type String
     *      */
    function create_v(json) {

        var width = 1400;
        var height = 600;
        var maxLabel = 150;
        var duration = 500;
        var radius = 5;

        var i = 0;
        var root;

        var tree = d3.layout.tree()
            .size([height, width]);

        var diagonal = d3.svg.diagonal()
            .projection(function (d) {
                return [d.y, d.x];
            });

        $('#visualize').empty();
        var svg = d3.select("#visualize").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + maxLabel + ",0)");


        root = json;
        root.x0 = height / 2;
        root.y0 = 0;

        /**
         * Most of this function is adopted from the site cited above. Used to create the tree structure.
         *
         * @param source
         */
        function update(source) {


            var nodes = tree.nodes(root).reverse();
            var links = tree.links(nodes);

            //normalization
            nodes.forEach(function (node) {
                node.y = node.depth * maxLabel;
            });

            // Update
            var node = svg.selectAll("g.node")
                .data(nodes, function (to_update) {
                    return to_update.id || (to_update.id = ++i);
                });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on("click", doubleclick)
                .on("dblclick", click);

            /**
             * append the circle with different color
             */
            nodeEnter.append("circle")
                .attr("r", 0)
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "white";
                });

            nodeEnter.append("text")
                .attr("x", function (d) {
                    var spacing = computeRadius(d) + 5;
                    return d.children || d._children ? -spacing : spacing;
                })
                .attr("dy", "3")
                .attr("text-anchor", function (d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function (d) {
                    return d.name;
                })
                .style("fill-opacity", 0);

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            nodeUpdate.select("circle")
                .attr("r", function (d) {
                    return computeRadius(d);
                })
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            nodeUpdate.select("text").style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .remove();

            nodeExit.select("circle").attr("r", 0);
            nodeExit.select("text").style("fill-opacity", 0);

            // Update the links
            var link = svg.selectAll("path.link")
                .data(links, function (d) {
                    return d.target.id;
                });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function (d) {
                    var o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                });

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function (d) {
                    var o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        function computeRadius(d) {
            if (d.children || d._children) return 10;
            else return radius;
        }

        function nbEndNodes(n) {
            nb = 0;
            if (n.children) {
                n.children.forEach(function (c) {
                    nb += nbEndNodes(c);
                });
            }
            else if (n._children) {
                n._children.forEach(function (c) {
                    nb += nbEndNodes(c);
                });
            }
            else nb++;

            return nb;
        }

        /**
         * check if it is click.
         * @param d
         */
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            }
            else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }

        /**
         * check if it double click
         * @param d
         */
        function doubleclick(d) {
            console.log("double click");
            id = d.name;
            $scope.set_current(get_scene(id));
            $scope.$apply()
        }

        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }

        update(root);
    }

}]);

