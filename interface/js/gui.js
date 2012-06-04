var GraphState = {
    addArc: false,
    rmEvt: false,
    edit: false,
    currentLabel: null
};

var handler = {
    sinkCreated: function () {

        var offset = $("#paper").offset();
        var width = $("#paper").width();
        var height = $("#paper").height();

        var evt = $("<div>", {
            "class": "sink",
            "storyboard_id": 2
        })
        .offset({
            top: offset.top + (height/2) - 25,
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
            dropOptions:{ hoverClass:"dragHover" },
            anchor:"Continuous"
        });

        evt.appendTo("#paper");
    },

    sourceCreated: function () {

        var offset = $("#paper").offset();
        var width = $("#paper").width();
        var height = $("#paper").height();

        var evt = $("<div>", {
            "class": "source",
            "storyboard_id": 1
        })
        .offset({
            top: offset.top + (height/2) - 25,
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
            //anchor:"BottomCenter",
            anchor: "Continuous",
            connector: [ "StateMachine", { curviness:20 } ],
            connectorStyle: { strokeStyle: "rgb(0,0,0)", lineWidth:1 },
            maxConnections: -1
        });

        evt.appendTo("#paper");
    },

    storyboardNotValid: function (validityReport) {
        console.log(validityReport);
        //TODO
    },

    storyboardProcessingCompleted: function (storyboard) {
        console.log("Storyboard processed successfully");
        //TODO
    }

};

var editSegment = function (label, evt) {
    if(GraphState.edit) {
        console.log(label);
        GraphState.currentLabel = label;
        GraphState.currentLogicSegment = storyboardController.storyboard.getSegmentById(label.component.getParameter("storyboard_id"));
        console.log(GraphState.currentLogicSegment);

        var act = (GraphState.currentLogicSegment.actor && GraphState.currentLogicSegment.description) || "default";
        $("#segment-actor option").filter(function() {
            return $(this).val() === act;
        }).attr('selected', true);

        $("#segment-duration").val(GraphState.currentLogicSegment.duration);
        $("#segment-description").val(GraphState.currentLogicSegment.description);

        $("#edit-segment-dialog-form").dialog("open");
    }
};

jsPlumb.importDefaults({
    Endpoint : ["Dot", {radius:2}],
    // HoverPaintStyle : {strokeStyle:"#42a62c", lineWidth:1 },
    ConnectionOverlays : [
        [ "Arrow", { 
            location:1,
            id:"arrow",
            length:10,
            foldback:0.8
        } ],
        [ "Label", {
            label:"",
            cssClass:"l1 component label",
            location:0.7,
            events:{
                "click": editSegment
            }
        }]
    ]
});

var storyboardController = new StoryboardController(handler);


$("#accordion").accordion({collapsible: true});


$("#error").dialog({
    autoOpen: false,
    modal: true
});

function updateCanvas(f) {

    var canvas = document.getElementById("segment-easing-canvas");
    canvas.width = 180;
    canvas.height = 100;

    var context = canvas.getContext( '2d' );
    context.fillStyle = "rgb(250,250,250)";
    context.fillRect( 0, 0, 180, 100 );

    context.lineWidth = 0.5;
    context.strokeStyle = "rgb(230,230,230)";

    context.beginPath();
    context.moveTo( 0, 20 );
    context.lineTo( 180, 20 );
    context.moveTo( 0, 80 );
    context.lineTo( 180, 80 );
    context.closePath();
    context.stroke();

    context.lineWidth = 2;
    context.strokeStyle = "rgb(255,127,127)";

    var position = { x: 5, y: 80 };
    var position_old = { x: 5, y: 80 };

    new TWEEN.Tween( position ).to( { x: 175 }, 2000 ).easing( TWEEN.Easing.Linear.None ).start();
    new TWEEN.Tween( position ).to( { y: 20 }, 2000 ).easing( f ).onUpdate( function () {

        context.beginPath();
        context.moveTo( position_old.x, position_old.y );
        context.lineTo( position.x, position.y );
        context.closePath();
        context.stroke();

        position_old.x = position.x;
        position_old.y = position.y;

    }).start();
}


function animate() {
    requestAnimationFrame( animate );
    TWEEN.update();
}

$("#segment-easing").on("change", function () {
    var func = $('option:selected', this).html().split(".");
    updateCanvas(TWEEN.Easing[func[0]][func[1]]);
    animate();
});

$("#edit-segment-dialog-form").dialog({
    autoOpen: false,
    height: 600,
    width: 350,
    modal: true,
    buttons: {
        "Confirm": function () {
            //TODO: connect to logic!!!
            var actor = $("#segment-actor").val();
            var duration = $("#segment-duration").val();
            var description = $("#segment-description").val();

            GraphState.currentLogicSegment.actor = actor;
            GraphState.currentLogicSegment.duration = duration;
            GraphState.currentLogicSegment.description = description;

            GraphState.currentLabel.setLabel(duration);
            $( this ).dialog( "close" );
        },

        Cancel: function() {
            $( this ).dialog( "close" );
        }
    },
    open: function (event, ui) {
        storyboardController.actors.forEach(function (actor) {
            $("#segment-actor").append($('<option></option>').val(actor.model).html(actor.description));
        });
    }
});

$("#add-actor-dialog-form").dialog({
    autoOpen: false,
    width: 350,
    height: 400,
    modal: true,
    buttons: {
        "Confirm": function () {
            var description = $("#actor-description").val();
            var model = $("#actor-model").val();
            var x = $("#actor-start-x").val();
            var y = $("#actor-start-y").val();
            var z = $("#actor-start-z").val();

            // TODO: eventually check and sanitize the input
            // TODO: storyboardController.addActor(model, description);
            storyboardController.addActor(model, description, {x0: x, y0: y, z0: z});

            $(this).dialog("close");
        },

        Cancel: function () {
            $(this).dialog("close");
        }
    },

    open: function (event, ui) {
        $("#actor-description").val("");
        $("#actor-model option").filter(function () {
            return $(this).val() === "default";
        }).attr('selected', true);
    }
});



jsPlumb.bind("jsPlumbConnection", function (info) {
        info.connection.setParameter("storyboard_id", storyboardController.nextSegmentId);
        var idStart = parseInt($("#" + info.sourceId).attr("storyboard_id"), 10);
        var idEnd = parseInt($("#" + info.targetId).attr("storyboard_id"), 10);

        storyboardController.startAddSegment(idStart, idEnd);
        storyboardController.addSegment();
});

jsPlumb.bind("beforeDrop", function (info) {
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


$("#addActor").on("click.webGraph", function () {
    $("#add-actor-dialog-form").dialog("open");
});


var createEvt =  function(x,y) {
    var evt = $("<div>", {
        "class": "event",
        "storyboard_id": storyboardController.nextEventId
    })
    .offset({
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
        dropOptions:{ hoverClass:"dragHover" },
        anchor:"Continuous"
    });

    jsPlumb.makeSource(holder, {
        parent: holder.parent(),
        //anchor:"BottomCenter",
        anchor: "Continuous",
        connector: [ "StateMachine", { curviness:20 } ],
        connectorStyle: { strokeStyle: "rgb(0,0,0)", lineWidth:1 },
        maxConnections: -1
    });

    storyboardController.addEvent();

    evt.appendTo("#paper");
};


var tool = {
    moveEvt: {
        on: function () {
            jsPlumb.setDraggable($(".event"), true);
        },

        off: function () {
            jsPlumb.setDraggable($(".event"), false);
        },

        el: "moveEvt"
    },

    insertEvt: {
        on: function () {
            $("#paper").on("click.webGraph", function (e) {
                if (e.target.id === "paper") {
                    var x = e.pageX - 25;
                    var y = e.pageY - 25;
                    var offset = $("#paper").offset();
                    var width = $("#paper").width();
                    var height = $("#paper").height();

                    if ( y < offset.top) {
                        y = offset.top;
                    }
                    else if( y > height + offset.top) {
                        y = height + offset.top;
                    }

                    if ( x < offset.left) {
                        x = offset.top;
                    }
                    else if( x > width + offset.left) {
                        x = width + offset.left;
                    }

                    createEvt(x,y);
                }
            });
        },

        off: function () {
            $("#paper").off("click.webGraph");
        },

        el: "insertEvt"
    },

    addSegment: {
        on: function () {
            $(".holder").show();
            GraphState.addArc = true;
        },

        off: function () {
            $(".holder").hide();
            GraphState.addArc = false;
        },

        el: "addSegment"
    },

    rm: {
        on: function () {
            GraphState.rmEvt = true;

            jsPlumb.select().each(function (conn) {
                conn.setHoverPaintStyle({strokeStyle: "#AA0000"});
            });

            $(".event")
            .on("click.webGraph", function () {
                // remove the event from the logic. 
                // The logic will take care of removing all the connections
                storyboardController.removeEvent(parseInt($(this).attr("storyboard_id"),10));

                // remove the event from the UI with all the connections
                jsPlumb.detachAllConnections($(this).attr("id"));
                $(this).remove();
            })
            .on("mouseenter.webGraph", function () {
                $(this).addClass("eventRemove");
                jsPlumb.select({source: $(this).attr("id") }).setPaintStyle({strokeStyle: "#A00"});
                jsPlumb.select({target: $(this).attr("id") }).setPaintStyle({strokeStyle: "#A00"});
            })
            .on("mouseleave.webGraph",function () {
                $(this).removeClass("eventRemove");
                jsPlumb.select({source: $(this).attr("id") }).setPaintStyle({strokeStyle: "#000"});
                jsPlumb.select({target: $(this).attr("id") }).setPaintStyle({strokeStyle: "#000"});
            });
        },

        off: function () {
            GraphState.rmEvt = false;
            jsPlumb.select().each(function (conn) {
                conn.setHover(false);
            });

            $(".event")
            .off("click.webGraph")
            .off("mouseenter.webGraph")
            .off("mouseleave.webGraph");
        },

        el: "rm"
    },

    edit: {
        on: function () {
            GraphState.edit = true;
        },

        off: function () {
            GraphState.edit = false;
        },

        el: "edit"
    }

};

(function (buttons) {
    this.selected = undefined;

    this.change = function(newFunction) {
        if( this.selected !== newFunction) {
            if(this.selected) {
                this.selected.off();
                $("#"+this.selected.el).toggleClass("selected");
            }

            this.selected = newFunction;
            this.selected.on();
            $("#"+this.selected.el).toggleClass("selected");
        }
        else {
            $("#"+this.selected.el).toggleClass("selected");
            this.selected.off();
            this.selected = undefined;
        }
    };

    var self = this;

    $("#moveEvt").on("click.toolbox", function () {
        self.change(buttons.moveEvt);
    });

    $("#insertEvt").on("click.toolbox", function () {
        self.change(buttons.insertEvt);
    });

    $("#addSegment").on("click.toolbox", function () {
        self.change(buttons.addSegment);
    });

    $("#rm").on("click.toolbox", function () {
        self.change(buttons.rm);
    });

    $("#edit").on("click.toolbox", function () {
        self.change(buttons.edit);
    });

}(tool));
