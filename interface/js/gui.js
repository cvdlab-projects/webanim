var handler = {
    createSink: function () {
        var evt = $("<div>", {
            "class": "event" //TODO: check for id and class
        })
        .offset({
            top: $("#paper").hight() - 25,
            left: $("#paper").width() - 28
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

        jsPlumb.makeTarget(evt, {
            dropOptions:{ hoverClass:"dragHover" },
            anchor:"Continuous"
        });

        evt.appendTo("#paper");
    },

    createSource: function () {
        var evt = $("<div>", {
            "class": "event" //TODO: check for id and class
        })
        .offset({
            top: $("#paper").hight() - 25,
            left: 28 
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

        jsPlumb.makeSource(holder, {
            parent: holder.parent(),
            //anchor:"BottomCenter",
            anchor: "Continuous",
            connector: [ "StateMachine", { curviness:20 } ],
            connectorStyle: { strokeStyle: "rgb(0,0,0)", lineWidth:2 },
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

var storyboardController = new StoryboardController(handler);

var GraphState = {
    addArc: false,
    rmEvt: false,
    currentLabel: null
};

$("#edit-segment-dialog-form").dialog({
    autoOpen: false,
    height: 600,
    width: 350,
    modal: true,
    buttons: {
        "Confirm": function () {
            var duration = $("#segment-duration").val();
            var description = $("#segment-description").val();

            GraphState.currentLogicSegment.duration = duration;
            GraphState.currentLogicSegment.description = description;

            GraphState.currentLabel.setLabel(duration);
            $( this ).dialog( "close" );
        },

        Cancel: function() {
            $( this ).dialog( "close" );
        }
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

            //TODO: eventually check and sanitize the input
            //TODO: storyboardController.addActor(model, description);
            $(this).dialog("close");
        },

        Cancel: function () {
            $(this).dialog("close");
        }
    }
});


var editSegment = function (label, evt) {
    GraphState.currentLabel = label;
    GraphState.currentLogicSegment = storyboardController.storyboard.getSegmentById(label.component.getParameter("storyboard_id"));

    $("#duration").val(GraphState.currentLogicSegment.duration);
    $("#description").val(GraphState.currentLogicSegment.description);
    $("#edit-segment-dialog-form").dialog("open");
};

jsPlumb.importDefaults({
    Endpoint : ["Dot", {radius:2}],
    HoverPaintStyle : {strokeStyle:"#42a62c", lineWidth:1 },
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

jsPlumb.bind("jsPlumbConnection", function (info) {
    info.connection.setParameter("storyboard_id", storyboardController.nextSegmentId);
    var idStart = parseInt($("#" + info.sourceId).attr("storyboard_id"), 10);
    var idEnd = parseInt($("#" + info.targetId).attr("storyboard_id"), 10);

    storyboardController.startAddSegment(idStart, idEnd);
    storyboardController.addSegment();
});




// remove segment

jsPlumb.bind("contextmenu", function(conn) {
    jsPlumb.detach(conn);

});

jsPlumb.bind("beforeDetach", function(conn) {
    if (GraphState.rmEvt) {
        storyboardController.removeSegment(conn.getParameter("storyboard_id"));
    }
    return GraphState.rmEvt;
});


// $("#rmEvt").toggle(
//     function () {
//         $(this).toggleClass("selected").children("span").html("ON");
//         GraphState.rmEvt = true;
//         $(".event").on("click.webGraph", function () {
//             // remove the event from the logic. 
//             // The logic will take care of removing all the connections
//             storyboardController.removeEvent(parseInt($(this).attr("storyboard_id"),10));
// 
//             // remove the event from the UI with all the connections
//             jsPlumb.detachAllConnections($(this).attr("id"));
//             $(this).remove();
//         });
//     },
//     function () {
//         $(this).toggleClass("selected").children("span").html("OFF");
//         GraphState.rmEvt = false;
//         $(".event").off("click.webGraph");
//     }
// );
// 
// $("#addArc").toggle(
//     function () {
//         $(this).toggleClass("selected");
//         $(".holder").show();
//         GraphState.addArc = true;
//     },
//     function () {
//         $(this).toggleClass("selected");
//         $(".holder").hide();
//         GraphState.addArc = false;
//     }
// );
// 
// $("#insertEvt").toggle(
//     function () {
//         $(this).toggleClass("selected");
//         $("#paper").on("click.webGraph", function (e) {
//             if (e.target.id === "paper") {
//                 var x = e.pageX - 25;
//                 var y = e.pageY - 25;
//                 var offset = $("#paper").offset();
//                 var width = $("#paper").width();
//                 var height = $("#paper").height();
// 
//                 if ( y < offset.top) {
//                     y = offset.top;
//                 }
//                 else if( y > height + offset.top) {
//                     y = height + offset.top;
//                 }
// 
//                 if ( x < offset.left) {
//                     x = offset.top;
//                 }
//                 else if( x > width + offset.left) {
//                     x = width + offset.left;
//                 }
// 
// 
//                 createEvt(x,y);
//             }
//         });
//     },
// 
//     function () {
//         $(this).toggleClass("selected");
//         $("#paper").off("click.webGraph");
// 
//     }
// );
// 
// $("#moveEvt").toggle(
//     function () {
//         $(this).toggleClass("selected");
//         jsPlumb.setDraggable($(".event"), true);
//     },
//     function () {
//         $(this).toggleClass("selected");
//         jsPlumb.setDraggable($(".event"), false);
//     }
// );
// 

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
        connectorStyle: { strokeStyle: "rgb(0,0,0)", lineWidth:2 },
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
            $(".event").on("click.webGraph", function () {
                // remove the event from the logic. 
                // The logic will take care of removing all the connections
                storyboardController.removeEvent(parseInt($(this).attr("storyboard_id"),10));

                // remove the event from the UI with all the connections
                jsPlumb.detachAllConnections($(this).attr("id"));
                $(this).remove();
            });
        },

        off: function () {
            GraphState.rmEvt = false;
            $(".event").off("click.webGraph");
        },

        el: "rm"
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

}(tool));
