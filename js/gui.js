var GraphState = {
    addArc: false,
    rmEvt: false,
    edit: false,
    currentLabel: null
};

var handler = {
    sinkCreated: function() {

        var offset = $("#paper").offset();
        var width = $("#paper").width();
        var height = $("#paper").height();

        var evt = $("<div>", {
            "class": "sink",
            "storyboard_id": 2
        }).offset({
            top: offset.top + (height / 2) - 25,
            left: offset.left + width - 53
        });

        var holder = $("<div>", {
            "class": "holder"
        });
        if (!GraphState.addArc) {
            holder.hide();
        }

        holder.appendTo(evt);

        jsPlumb.draggable(evt, {
            containment: "parent"
        });

        jsPlumb.setDraggable(evt, false);

        jsPlumb.makeTarget(evt, {
            dropOptions: {
                hoverClass: "dragHover"
            },
            anchor: "Continuous"
        });

        evt.appendTo("#paper");
    },

    sourceCreated: function() {

        var offset = $("#paper").offset();
        var width = $("#paper").width();
        var height = $("#paper").height();

        var evt = $("<div>", {
            "class": "source",
            "storyboard_id": 1
        }).offset({
            top: offset.top + (height / 2) - 25,
            left: offset.left + 3
        });

        var holder = $("<div>", {
            "class": "holder"
        });
        if (!GraphState.addArc) {
            holder.hide();
        }

        holder.appendTo(evt);

        jsPlumb.draggable(evt, {
            containment: "parent"
        });
        jsPlumb.setDraggable(evt, false);

        jsPlumb.makeSource(holder, {
            parent: holder.parent(),
            anchor: "Continuous",
            connector: ["StateMachine",
            {
                curviness: 20
            }],
            maxConnections: -1
        });

        evt.appendTo("#paper");
    },

    storyboardNotValid: function(validityReport) {
        console.log("The storyboard is not valid");
        console.log(validityReport);
        console.log(JSON.stringify(validityReport));
        var message = "The storyboard is not valid<br><br>";

        if (validityReport.cycles) {
            message += "There are cycles in the graph<br><br>";
        }
        if (validityReport.reachability) {
            message += "There are no paths from the source to the sink<br><br>";
        }
        if (validityReport.degrees.outgoing) {
            message += "There are one or more Events with no outgoing segments<br><br>";
        }
        if (validityReport.degrees.incoming) {
            message += "There are one or more Events with no incoming segments<br><br>";
        }
        error(message);
    },

    storyboardProcessingCompleted: function(storyboard) {
        console.log("Ci sto dentro");
        //init($("#canvas").width(), $("#canvas").height(), storyboard);
        setupScene($("#canvas").width(), $("#canvas").height(), storyboard);
        window.api.next();
    }

};

var error = function (message) {
    $("#error").html(message).dialog("open");
};

var editSegment = function(label, evt) {
    if (!GraphState.rmEvt) {
        GraphState.currentLabel = label;
        GraphState.currentLogicSegment = storyboardController.storyboard.getSegmentById(label.component.getParameter("storyboard_id"));
        //GraphState.currentSegmentId = label.component.getParameter("storyboard_id");
        var segment = GraphState.currentLogicSegment;
        console.log(segment);

        var act = (segment.actor && segment.actor.id) || "default";
        $("#segment-actor option").filter(function() {
            return $(this).val() == act;
        }).attr('selected', true);

        $("#segment-duration").val(segment.duration);
        $("#segment-description").val(segment.description);

        $("#segment-easing option").filter(function () {
            return $(this).val() === "Linear.None";
        }).attr('selected', true);

        var behaviour = segment.behaviour;
        if (behaviour) {
            if (behaviour.position) {
                $("#segment-pos-to-x").val(behaviour.position.x);
                $("#segment-pos-to-y").val(behaviour.position.y);
                $("#segment-pos-to-z").val(behaviour.position.z);
            }

            if (behaviour.rotation) {
                $("#segment-rot-to-a").val(behaviour.rotation.x);
                $("#segment-rot-to-b").val(behaviour.rotation.y);
                $("#segment-rot-to-g").val(behaviour.rotation.z);
            }

            if (behaviour.scale) {
                $("#segment-scale-to-x").val(behaviour.scale.x);
                $("#segment-scale-to-y").val(behaviour.scale.y);
                $("#segment-scale-to-z").val(behaviour.scale.z);
            }

            $("#segment-easing option").filter(function () {
                return $(this).val() === behaviour.easing;
            }).attr('selected', true);
        }

        $("#edit-segment-dialog-form").dialog("open");
    }
};

jsPlumb.importDefaults({
    Endpoint: ["Dot",
    {
        radius: 2
    }],
    PaintStyle: {
        strokeStyle: "#F70",
        lineWidth: 1
    },
    ConnectionOverlays: [
        ["Arrow",
        {
            location: 1,
            id: "arrow",
            length: 10,
            foldback: 0.8
        }],
        ["Label",
        {
            label: "",
            cssClass: "l1 component label",
            location: 0.7,
            events: {
                "click": editSegment
            }
        }]
    ]
});

var storyboardController = new StoryboardController(handler);

$("#accordion").accordion({
    collapsible: false
});


$("#error").dialog({
    autoOpen: false,
    modal: true
});

function clearEasingCanvas() {
    var canvas = document.getElementById("segment-easing-canvas");
    var context = canvas.getContext('2d');
    context.fillStyle = "rgb(250,250,250)";
    context.fillRect(0, 0, 180, 100);
    context.lineWidth = 0.5;
    context.strokeStyle = "rgb(230,230,230)";

    context.beginPath();
    context.moveTo(0, 20);
    context.lineTo(180, 20);
    context.moveTo(0, 80);
    context.lineTo(180, 80);
    context.closePath();
    context.stroke();
}

function updateCanvas(f) {

    var canvas = document.getElementById("segment-easing-canvas");
    canvas.width = 180;
    canvas.height = 100;

    var context = canvas.getContext('2d');
    context.fillStyle = "rgb(250,250,250)";
    context.fillRect(0, 0, 180, 100);

    context.lineWidth = 0.5;
    context.strokeStyle = "rgb(230,230,230)";

    context.beginPath();
    context.moveTo(0, 20);
    context.lineTo(180, 20);
    context.moveTo(0, 80);
    context.lineTo(180, 80);
    context.closePath();
    context.stroke();

    context.lineWidth = 2;
    context.strokeStyle = "rgb(255,127,127)";

    var position = {
        x: 5,
        y: 80
    };
    var position_old = {
        x: 5,
        y: 80
    };

    new TWEEN.Tween(position).to({
        x: 175
    }, 2000).easing(TWEEN.Easing.Linear.None).start();
    new TWEEN.Tween(position).to({
        y: 20
    }, 2000).easing(f).onUpdate(function() {

        context.beginPath();
        context.moveTo(position_old.x, position_old.y);
        context.lineTo(position.x, position.y);
        context.closePath();
        context.stroke();

        position_old.x = position.x;
        position_old.y = position.y;

    }).start();
}


function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
}

$("#segment-easing").on("change", function() {
    var func = $('option:selected', this).html().split(".");
    updateCanvas(TWEEN.Easing[func[0]][func[1]]);
    animate();
});

function updateTips(t) {
    $(".validateTips").text(t).addClass("ui-state-highlight");
    // setTimeout(function() {
    //     $(".validateTips").removeClass("ui-state-highlight", 1500);
    // }, 500);
}

function checkRegexp(o, regexp, n) {
    if (!(regexp.test(o.val()))) {
        o.addClass("ui-state-error");
        updateTips(n);
        return false;
    } else {
        o.removeClass("ui-state-error");
        return true;
    }
}

function checkCameraZ(o, n) {
    var number = o.val();
    if (number < 800) {
        o.addClass("ui-state-error");
        updateTips(n);

        return false;
    }
    else {
        o.removeClass("ui-state-error");
        return true;
    }
}

function checkDigits(o, n, i) {
    var number = o.val();
    if (!(!isNaN(parseFloat(number)) && isFinite(number))) {
        o.addClass("ui-state-error");
        updateTips(n);
        $("#accordion").accordion('activate', i);

        return false;
    } else {
        o.removeClass("ui-state-error");
        return true;
    }
}

function checkSelect(o, m, i) {
    if (o.val() === 'default') {
        o.addClass("ui-state-error");
        updateTips(m);
        $("#accordion").accordion('activate', i);

        return false;
    } else {
        o.removeClass("ui-state-error");
        return true;
    }
}

$("#edit-segment-dialog-form").dialog({
    autoOpen: false,
    height: 600,
    width: 370,
    modal: true,
    buttons: {
        "Confirm": function() {
            var actor = $("#segment-actor");
            var duration = $("#segment-duration");
            var description = $("#segment-description");

            var valid_t = true;
            var valid_r = true;
            var valid_s = true;

            var pos_x = $("#segment-pos-to-x");
            var pos_y = $("#segment-pos-to-y");
            var pos_z = $("#segment-pos-to-z");
            var pos = [pos_x, pos_y, pos_z];

            var rotate_a = $("#segment-rot-to-a");
            var rotate_b = $("#segment-rot-to-b");
            var rotate_g = $("#segment-rot-to-g");
            var rotate = [rotate_a, rotate_b, rotate_g];

            var scale_x = $("#segment-scale-to-x");
            var scale_y = $("#segment-scale-to-y");
            var scale_z = $("#segment-scale-to-z");
            var scale = [scale_x, scale_y, scale_z];

            var easing = $("#segment-easing");

            var check = true;

            check = check && checkSelect(actor, "You must choose an actor");
            check = check && checkDigits(duration, "This must be a number");

            var posCheck = pos.some(function (e) {
                return e.val() !== "";
            });
            if (posCheck) {
                check = check && checkDigits(pos_x, "This must be a number", 0);
                check = check && checkDigits(pos_y, "This must be a number", 0);
                check = check && checkDigits(pos_z, "This must be a number", 0);
            }

            var rotateCheck = rotate.some(function (e) {
                return e.val() !== "";
            });
            if (rotateCheck) {
                check = check && checkDigits(rotate_a, "This must be a number", 1);
                check = check && checkDigits(rotate_b, "This must be a number", 1);
                check = check && checkDigits(rotate_g, "This must be a number", 1);
            }

            var scaleCheck = scale.some(function (e) {
                return e.val() !== "";
            });
            if (scaleCheck) {
                check = check && checkDigits(scale_x, "This must be a number", 2);
                check = check && checkDigits(scale_y, "This must be a number", 2);
                check = check && checkDigits(scale_z, "This must be a number", 2);
            }

            check = check && checkSelect(easing, "You must choose an easing function", 3);

            //check if it is all alright

            if (check) {
                var behaviour = {
                    easing: easing.val()
                };
                if (posCheck) {
                    behaviour.position= {
                        x: pos_x.val(),
                        y: pos_y.val(),
                        z: pos_z.val()
                    };
                }
                if (rotateCheck) {
                    behaviour.rotation = {
                        x: rotate_a.val(),
                        y: rotate_b.val(),
                        z: rotate_g.val()
                    };
                }
                if (scaleCheck) {
                    behaviour.scale = {
                        x: scale_x.val(),
                        y: scale_y.val(),
                        z: scale_z.val()
                    };
                }

                GraphState.currentLabel.component.setParameter("initialize", true);

                storyboardController.setDescriptionForSegment(GraphState.currentLogicSegment.id, description.val());
                storyboardController.setDurationForSegment(GraphState.currentLogicSegment.id, duration.val());
                storyboardController.setActorForSegment(GraphState.currentLogicSegment.id, parseInt(actor.val(), 10));
                storyboardController.setBehaviourForSegment(GraphState.currentLogicSegment.id, behaviour);

                GraphState.currentLabel.setLabel(duration.val());
                GraphState.currentLabel.component.setPaintStyle({
                    strokeStyle: "#000"
                });

                $(this).dialog("close");
            }


        },

        Cancel: function() {
            $(this).dialog("close");
        }
    },

    beforeClose: function (event, ui) {
        $(".validateTips").text("").removeClass("ui-state-highlight");
        $(".ui-state-error").removeClass("ui-state-error");

        $("#segment-actor option").filter(function () {
            return $(this).val() === "default";
        }).attr('selected', true);

        $("#segment-duration").val("");
        $("#segment-description").val("");

        $("#segment-pos-to-x").val("");
        $("#segment-pos-to-y").val("");
        $("#segment-pos-to-z").val("");

        $("#segment-rot-to-a").val("");
        $("#segment-rot-to-b").val("");
        $("#segment-rot-to-g").val("");

        $("#segment-scale-to-x").val("");
        $("#segment-scale-to-y").val("");
        $("#segment-scale-to-z").val("");

        $("#segment-easing option").filter(function () {
            return $(this).val() === "default";
        }).attr('selected', true);
        clearEasingCanvas();
    }
});

$("#add-actor-dialog-form").dialog({
    autoOpen: false,
    width: 350,
    height: 400,
    modal: true,
    buttons: {
        "Confirm": function() {
            var check = true;

            var pos_x = $("#actor-start-pos-x");
            var pos_y = $("#actor-start-pos-y");
            var pos_z = $("#actor-start-pos-z");

            var rotate_a = $("#actor-start-rotate-a");
            var rotate_b = $("#actor-start-rotate-b");
            var rotate_g = $("#actor-start-rotate-g");

            var scale_x = $("#actor-start-scale-x");
            var scale_y = $("#actor-start-scale-y");
            var scale_z = $("#actor-start-scale-z");

            var description = $("#actor-description");

            var model = $("#actor-model");

            check = check && checkRegexp(description, /^[0-9a-zA-Z_][0-9a-zA-Z_\s]+$/i, "This field is required");
            check = check && checkSelect(model, "You must choose a model");

            check = check && checkDigits(pos_x, "This must be a number");
            check = check && checkDigits(pos_y, "This must be a number");
            check = check && checkDigits(pos_z, "This must be a number");
            console.log(model.val());
            // if (model.val() === 'Camera') {
            //     check = check && checkCameraZ(pos_z, "This value must be at least 800");
            // }

            check = check && checkDigits(rotate_a, "This must be a number");
            check = check && checkDigits(rotate_b, "This must be a number");
            check = check && checkDigits(rotate_g, "This must be a number");

            check = check && checkDigits(scale_x, "This must be a number");
            check = check && checkDigits(scale_y, "This must be a number");
            check = check && checkDigits(scale_z, "This must be a number");

            if (check) {
                $("#segment-actor").append($('<option></option>').val(storyboardController.nextActorId).html(description.val()));

                //TODO: pass the rotate and scaling information on the logic
                storyboardController.addActor(model.val(), description.val(), {
                    tx: pos_x.val(),
                    ty: pos_y.val(),
                    tz: pos_z.val(),
                    rx: rotate_a.val(),
                    ry: rotate_b.val(),
                    rz: rotate_g.val(),
                    sx: scale_x.val(),
                    sy: scale_y.val(),
                    sz: scale_z.val()
                });

                storyboardController.actors.forEach(function(actor) {
                    console.log(actor);
                });

                $(this).dialog("close");
            }
        },

        Cancel: function() {
            $(this).dialog("close");
        }
    },

    open: function(event, ui) {

        var pos_x = $("#actor-start-pos-x");
        var pos_y = $("#actor-start-pos-y");
        var pos_z = $("#actor-start-pos-z");

        var rotate_a = $("#actor-start-rotate-a");
        var rotate_b = $("#actor-start-rotate-b");
        var rotate_g = $("#actor-start-rotate-g");

        var scale_x = $("#actor-start-scale-x");
        var scale_y = $("#actor-start-scale-y");
        var scale_z = $("#actor-start-scale-z");

        var description = $("#actor-description");

        description.val("");

        pos_x.val("0");
        pos_y.val("0");
        pos_z.val("0");

        rotate_a.val("0");
        rotate_b.val("0");
        rotate_g.val("0");

        scale_x.val("1");
        scale_y.val("1");
        scale_z.val("1");

        $([]).add(description).add(pos_x).add(pos_y).add(pos_z).add(rotate_a).add(rotate_b).add(rotate_g).add(scale_x).add(scale_y).add(scale_z).removeClass("ui-state-error");

        $("#actor-model option").filter(function() {
            return $(this).val() === "default";
        }).attr('selected', true);
    },

    beforeClose: function (event, ui) {
        $(".validateTips").text("").removeClass("ui-state-highlight");
        $(".ui-state-error").removeClass("ui-state-error");
    }
});



jsPlumb.bind("jsPlumbConnection", function(info) {
    info.connection.setParameter("storyboard_id", storyboardController.nextSegmentId);
    info.connection.setParameter("initialize", false);
    var idStart = parseInt($("#" + info.sourceId).attr("storyboard_id"), 10);
    var idEnd = parseInt($("#" + info.targetId).attr("storyboard_id"), 10);

    storyboardController.startAddSegment(idStart, idEnd);
    storyboardController.addSegment();
});

jsPlumb.bind("beforeDrop", function(info) {
    return info.sourceId !== info.targetId;
});


// remove segment
jsPlumb.bind("click", function(conn) {
    jsPlumb.detach(conn);

});

jsPlumb.bind("beforeDetach", function(conn) {
    if (GraphState.rmEvt) {
        storyboardController.removeSegment(conn.getParameter("storyboard_id"));
    }
    return GraphState.rmEvt;
});


$("#addActor").on("click.webGraph", function() {
    $("#add-actor-dialog-form").dialog("open");
});


var createEvt = function(x, y) {
        var evt = $("<div>", {
            "class": "event",
            "storyboard_id": storyboardController.nextEventId
        }).offset({
            top: y,
            left: x
        });

        var holder = $("<div>", {
            "class": "holder"
        });
        if (!GraphState.addArc) {
            holder.hide();
        }

        holder.appendTo(evt);

        jsPlumb.draggable(evt, {
            containment: "parent"
        });

        jsPlumb.setDraggable(evt, false);

        jsPlumb.makeTarget(evt, {
            dropOptions: {
                hoverClass: "dragHover"
            },
            anchor: "Continuous"
        });

        jsPlumb.makeSource(holder, {
            parent: holder.parent(),
            anchor: "Continuous",
            connector: ["StateMachine",
            {
                curviness: 20
            }],
            maxConnections: -1
        });

        storyboardController.addEvent();

        evt.appendTo("#paper");
    };

$("#calculate").on("click.webGraph", function() {
    var allValid = true;

    jsPlumb.select().each(function(conn) {
        allValid = allValid && conn.getParameter("initialize");
    });

    if (!allValid) {
        error("not all segment are initialize! check the orange one!");

        return;
    }

    $("#Timeline").del();
    $("#Timeline").Timeline({
        data: storyboardController.populateTimeline(),
        slideWidth: 900,
        frame: [],
        behavior: {
                    onClick: function (data) { 
                        var msg = "You clicked on segment " + data.name + ": { start: " + data.start + ", end: " + data.end + " }";
                        $("#eventMessage").text(msg);
                        // Qui facciamo il scene.remove () ...
                    },
                    onClick2: function (t) { 
                        var msg = "You clicked on column: " + t;
                        $("#eventMessage").text(msg);
                        gotoFrame (t * 12000 / 100); // TODO: bisogna conoscere la durata totale
                    },
                    onClick3: function (t) { 
                        var msg = "You clicked on actor: " + t;
                        $("#eventMessage").text(msg);
                    },
                    onClick4: function (t) { 
                        var msg = "You deselect the actor " + t;
                        $("#eventMessage").text(msg);
                    }
        }

    });
  
    storyboardController.processStoryboard();
});

var tool = {
    moveEvt: {
        on: function() {
            jsPlumb.setDraggable($(".event"), true);
        },

        off: function() {
            jsPlumb.setDraggable($(".event"), false);
        },

        el: "moveEvt"
    },

    insertEvt: {
        on: function() {
            $("#paper").on("click.webGraph", function(e) {
                if (e.target.id === "paper") {
                    var x = e.pageX - 25;
                    var y = e.pageY - 25;
                    var offset = $("#paper").offset();
                    var width = $("#paper").width();
                    var height = $("#paper").height();

                    if (y < offset.top) {
                        y = offset.top;
                    } else if (y > height + offset.top) {
                        y = height + offset.top;
                    }

                    if (x < offset.left) {
                        x = offset.top;
                    } else if (x > width + offset.left) {
                        x = width + offset.left;
                    }

                    createEvt(x, y);
                }
            });
        },

        off: function() {
            $("#paper").off("click.webGraph");
        },

        el: "insertEvt"
    },

    addSegment: {
        on: function() {
            $(".holder").show();
            GraphState.addArc = true;
        },

        off: function() {
            $(".holder").hide();
            GraphState.addArc = false;
        },

        el: "addSegment"
    },

    rm: {
        on: function() {
            GraphState.rmEvt = true;

            jsPlumb.select().each(function(conn) {
                conn.setHoverPaintStyle({
                    strokeStyle: "#AA0000"
                });
            });

            $(".event").on("click.webGraph", function() {
                // remove the event from the logic. 
                // The logic will take care of removing all the connections
                storyboardController.removeEvent(parseInt($(this).attr("storyboard_id"), 10));

                // remove the event from the UI with all the connections
                jsPlumb.detachAllConnections($(this).attr("id"));
                $(this).remove();
            }).on("mouseenter.webGraph", function() {
                $(this).addClass("eventRemove");
                jsPlumb.select({
                    source: $(this).attr("id")
                }).setPaintStyle({
                    strokeStyle: "#A00"
                });
                jsPlumb.select({
                    target: $(this).attr("id")
                }).setPaintStyle({
                    strokeStyle: "#A00"
                });
            }).on("mouseleave.webGraph", function() {
                $(this).removeClass("eventRemove");
                jsPlumb.select({
                    source: $(this).attr("id")
                }).setPaintStyle({
                    strokeStyle: "#000"
                });
                jsPlumb.select({
                    target: $(this).attr("id")
                }).setPaintStyle({
                    strokeStyle: "#000"
                });
            });
        },

        off: function() {
            GraphState.rmEvt = false;
            jsPlumb.select().each(function(conn) {
                conn.setHover(false);
            });

            $(".event").off("click.webGraph").off("mouseenter.webGraph").off("mouseleave.webGraph");
        },

        el: "rm"
    }
};

(function(buttons) {
    this.selected = undefined;

    this.change = function(newFunction) {
        if (this.selected !== newFunction) {
            if (this.selected) {
                this.selected.off();
                $("#" + this.selected.el).toggleClass("selected");
            }

            this.selected = newFunction;
            this.selected.on();
            $("#" + this.selected.el).toggleClass("selected");
        } else {
            $("#" + this.selected.el).toggleClass("selected");
            this.selected.off();
            this.selected = undefined;
        }
    };

    var self = this;

    $("#moveEvt").on("click.toolbox", function() {
        self.change(buttons.moveEvt);
    });

    $("#insertEvt").on("click.toolbox", function() {
        self.change(buttons.insertEvt);
    });

    $("#addSegment").on("click.toolbox", function() {
        self.change(buttons.addSegment);
    });

    $("#rm").on("click.toolbox", function() {
        self.change(buttons.rm);
    });

    $("#edit").on("click.toolbox", function() {
        self.change(buttons.edit);
    });

}(tool));
