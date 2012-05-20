var GraphState = {
    addArc: false,
    rmEvt: false,
    currentLabel: null
};

$("#dialog-form").dialog({
    autoOpen: false,
    height: 300,
    width: 350,
    modal: true,
    buttons: {
        "Confirm": function () {
            GraphState.currentLabel.setLabel($("#duration").val());
            $( this ).dialog( "close" );
        },

        Cancel: function() {
            $( this ).dialog( "close" );
        }
    }
});

var editSegment = function (label, evt) {
    GraphState.currentLabel = label;
    $("#dialog-form").dialog("open");
    console.log(label);
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

$("#paper").on("click.webGraph", function (e) {
    if (e.target.id === "paper") {
        var x = e.pageX;
        var y = e.pageY;

        createEvt(x,y);
    }
});


// remove segment

jsPlumb.bind("click", function(conn) {
    jsPlumb.detach(conn);
});
jsPlumb.bind("beforeDetach", function(conn) {
    return GraphState.rmEvt;
});

$("#rmEvt").toggle(
    function () {
        $(this).toggleClass("selected").children("span").html("ON");
        GraphState.rmEvt = true;
        $(".event").on("click.webGraph", function () {
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
        $(this).toggleClass("selected").children("span").html("ON");
        $(".holder").show();
        GraphState.addArc = true;
    },
    function () {
        $(this).toggleClass("selected").children("span").html("OFF");
        $(".holder").hide();
        GraphState.addArc = false;
    }
);


var createEvt =  function(x,y) {
    var evt = $("<div>", {
        "class": "event"
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

    evt.appendTo("#paper");
};
