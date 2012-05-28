var storyboardController = new StoryboardController();

var GraphState = {
    addArc: false,
    rmEvt: false,
    currentLabel: null
};

$("#dialog-form").dialog({
    autoOpen: false,
    height: 600,
    width: 350,
    modal: true,
    buttons: {
        "Confirm": function () {
            var duration = $("#duration").val();
            var description = $("#description").val();

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

var editSegment = function (label, evt) {
    GraphState.currentLabel = label;
    GraphState.currentLogicSegment = storyboardController.storyboard.getSegmentById(label.component.getParameter("storyboard_id"));

    $("#duration").val(GraphState.currentLogicSegment.duration);
    $("#description").val(GraphState.currentLogicSegment.description);
    $("#dialog-form").dialog("open");
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

jsPlumb.bind("click", function(conn) {
    jsPlumb.detach(conn);
});
jsPlumb.bind("beforeDetach", function(conn) {
    if (GraphState.rmEvt) {
        storyboardController.removeSegment(conn.getParameter("storyboard_id"));
    }
    return GraphState.rmEvt;
});


$("#rmEvt").toggle(
    function () {
        $(this).toggleClass("selected").children("span").html("ON");
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
    function () {
        $(this).toggleClass("selected").children("span").html("OFF");
        GraphState.rmEvt = false;
        $(".event").off("click.webGraph");
    }
);

$("#addArc").toggle(
    function () {
        $(this).toggleClass("selected");
        $(".holder").show();
        GraphState.addArc = true;
    },
    function () {
        $(this).toggleClass("selected");
        $(".holder").hide();
        GraphState.addArc = false;
    }
);

$("#moveEvt").toggle(
    function () {
        $(this).toggleClass("selected");
        jsPlumb.setDraggable($(".event"), true);
        $("#paper").on("click.webGraph", function (e) {
            if (e.target.id === "paper") {
                var x = e.pageX;
                var y = e.pageY;

                createEvt(x,y);
            }
        });
    },
    function () {
        $(this).toggleClass("selected");
        $("#paper").off("click.webGraph");
        jsPlumb.setDraggable($(".event"), false);

    }
);


var createEvt =  function(x,y) {
    var evt = $("<div>", {
        "class": "event",
        "storyboard_id": storyboardController.nextEventId
    })
    .offset({
        top: y - 25, 
        left: x - 25
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
