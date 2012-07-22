(function (jQuery) {
	
    jQuery.fn.Timeline = function () {
    	
    	var args = Array.prototype.slice.call(arguments);
    	
    	if (args.length == 1 && typeof(args[0]) == "object") {
        	InitBuild.call(this, args[0]);
    	}
    };
    
    var opts;

    function InitBuild(options) {
    	
    	var els = this;
        var defaults = {

            cellWidth: 21,
            cellHeight: 31,
            slideWidth: 400, //se vi sono pochi secondi ridurla con una funione!!!
            vHeaderWidth: 100,
            behavior: {
            	clickable: true,
            },

			start: null,
			end: null,
			focus: null
        };
        
        opts = jQuery.extend(true, defaults, options);

		if (opts.data) {
			build();
		} 

		function build() {
			
            /* ritorno il tempo finale dell' animazione */
            opts.start = 0;
            opts.end = 100; //valore da ottenere dinamicamente con una funzione

	        els.each(function () {

	            var container = jQuery(this);
	            var div = jQuery("<div>", { "class": "timeline" });
	            new Chart(div, opts).render();
				container.append(div);
				
				var w = jQuery("div.timeline-vtheader", container).outerWidth() +
					jQuery("div.timeline-slide-container", container).outerWidth();
	            container.css("width", (w + 2) + "px");
          
	            new Behavior(container, opts).apply();
                
                if (opts.onLoad)
                    opts.onLoad(container);
	        });
		}

    }

	var Chart = function(div, opts) {

		function render() {
			addVtHeader(div, opts.data, opts.cellHeight); //crea la colonna col nome degli attori

            var slideDiv = jQuery("<div>", { //crea il contenitore
                "class": "timeline-slide-container",
                "css": { "width": opts.slideWidth + "px" }
            });
			
            //funzione che ritorna un array che contenga tutte le possibili date tra due intervalli
            times = getTimes(opts.start, opts.end); 
            addHzHeader(slideDiv, times, opts.cellWidth);
            addGrid(slideDiv, opts.data, times, opts.cellWidth);
            addBlockContainers(slideDiv, opts.data);
            addBlocks(slideDiv, opts.data, opts.cellWidth, opts.start);
            div.append(slideDiv);
            applyLastClass(div.parent());
			focus(opts.focus);
		}
		

        function getTimes(start, end) {
            var times = [];
            for( var next = 0; next<= end; next++ ){
                times[next]=next;
            }
            return times;
        }

        //crea le righe: 1 per ogni attore
        function addVtHeader(div, data, cellHeight) {
            var headerDiv = jQuery("<div>", { "class": "timeline-vtheader" });
            for (var i = 0; i < data.length; i++) {
                var itemDiv = jQuery("<div>", { "class": "timeline-vtheader-item", "hide":"true", "id":i });
                
                itemDiv.append(jQuery("<div>", {
                    "class": "timeline-vtheader-item-name",
                    "css": { "height": cellHeight + "px" }
                }).append(jQuery("<input>", { 
                    "id": "check", 
                    "type":"checkbox", 
                    "checked" : "true",
                    "id" : i
                })).append(data[i].name + " " + data[i].id)); //nome/tipo attore

                headerDiv.append(itemDiv);
            }
            div.append(headerDiv);
        }

        function addHzHeader(div, times, cellWidth) {
            var headerDiv = jQuery("<div>", { "class": "timeline-hzheader" });
            var msDiv = jQuery("<div>", { "class": "timeline-hzheader-ms" });
            var secsDiv = jQuery("<div>", { "class": "timeline-hzheader-secs" });

            var minutes=0;
            var w = 60 * cellWidth;

            msDiv.append(jQuery("<div>", {
                        "class": "timeline-hzheader-m",
                        "css": { "width": (w - 1) + "px" }
            }).append("minuto " + minutes));
            
            for (var y in times) {
                        secsDiv.append(jQuery("<div>", { "class": "timeline-hzheader-sec", "id" : "0", "sec":y }).append(y%60));   

                        if(y%60 ==0 && y!=0){
                                minutes++;
                                if(y-times.length<60){w = (times.length-y) * cellWidth; }
                                else w = 40 * cellWidth;
                                msDiv.append(jQuery("<div>", {
                                    "class": "timeline-hzheader-m",
                                    "css": { "width": (w - 1) + "px" }
                                }).append("minuto " + minutes));
                        }
            }

            msDiv.css("width", times.length * cellWidth + "px");
            secsDiv.css("width", times.length * cellWidth + "px");
            headerDiv.append(msDiv).append(secsDiv);
            div.append(headerDiv);
        }

        function addGrid(div, data, times, cellWidth) {
            var gridDiv = jQuery("<div>", { "class": "timeline-grid" });
            var rowDiv = jQuery("<div>", { "class": "timeline-grid-row" });
			for (var y in times) {
                var cellDiv = jQuery("<div>", { "class": "timeline-grid-row-cell", "id": y });
                rowDiv.append(cellDiv);
			}
            var w = jQuery("div.timeline-grid-row-cell", rowDiv).length * cellWidth;
            rowDiv.css("width", w + "px");
            gridDiv.css("width", w + "px");
            for (var i = 0; i < data.length; i++) {
                gridDiv.append(rowDiv.clone());
            }
            div.append(gridDiv);
        }

        function addBlockContainers(div, data) {
            var blocksDiv = jQuery("<div>", { "class": "timeline-blocks" });
            for (var i = 0; i < data.length; i++) {
                blocksDiv.append(jQuery("<div>", { "class": "timeline-block-container" }));
            }
            div.append(blocksDiv);
        }

        function addBlocks(div, data, cellWidth, start) {
            var rows = jQuery("div.timeline-blocks div.timeline-block-container", div);
            var rowIdx = 0;
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].series.length; j++) {
                    var series = data[i].series[j];
                    var size = (series.end - series.start +1);
					var offset = series.start - start;
                    var block = jQuery("<div>", {
                        "class": "timeline-block",
                        "title": series.title ? series.title : series.name + ", " + size + " seconds",
                        "css": {
                            "width": ((size * cellWidth) - 9) + "px",
                            "left": ((offset * cellWidth) + 3) + "px"
                        },
                        "start": offset,
                        "duration": size
                    });
                    addBlockData(block, data[i], series);

                    block.append(jQuery("<div>", { "class": "timeline-block-text" }).text(size));
                    jQuery(rows[rowIdx]).append(block);
                }

                rowIdx = rowIdx + 1;
            }
        }
        
        function addBlockData(block, data, series) {
        	// This allows custom attributes to be added to the series data objects
        	// and makes them available to the 'data' argument of click, resize, and drag handlers
        	var blockData = { id: data.id, name: data.name };
        	jQuery.extend(blockData, series);
        	block.data("block-data", blockData);
        }

        function applyLastClass(div) {
            jQuery("div.timeline-grid-row div.timeline-grid-row-cell:last-child", div).addClass("last");
            jQuery("div.timeline-hzheader-secs div.timeline-hzheader-sec:last-child", div).addClass("last");
            jQuery("div.timeline-hzheader-ms div.timeline-hzheader-m:last-child", div).addClass("last");
        }
		
		return {
			render: render
		};
	}

    

	var Behavior = function (div, opts) {
		var frame = opts.frame;
        //if(opts==null) return null;
		function apply() {
            bindBlockEvent(div, "mouseover", opts.behavior.onMouseOver);
            bindBlockEvent(div, "mouseout", opts.behavior.onMouseOut);

			if (opts.behavior.clickable) { 
            	bindBlockEvent(div, "click", opts.behavior.onClick);
                bindColumnEvent(div, "click", opts.behavior.onClick2);
                ActorSelection(opts.data, opts.behavior.onClick3,opts.behavior.onClick4);
        	}

		}

        function bindBlockEvent(div, eventName, callback) {
            jQuery("div.timeline-block", div).live(eventName, function () {
                if (callback) { callback(jQuery(this).data("block-data"), this); }
            });
        }
        
        
        function bindColumnEvent(div, eventName, callback) {
            jQuery("div.timeline-hzheader-sec", div).live(eventName, function () {
                
                    if(jQuery(this).attr('id') == "0"){
                        selectColumn( jQuery(this).attr('sec') );

                        jQuery(this).attr('id','1'); 
                        jQuery(this).addClass('special');

                    }
                    else {
                        jQuery(this).attr('id','0'); 
                        jQuery(this).removeClass('special');

                        deselectColumn( jQuery(this).attr('sec') );
                    }

                if (callback) { callback(jQuery(this).attr('sec'), this); }
            });
        }   
   

        function selectColumn (index){
            index = parseInt(index);
            if (frame.length == 0){
                frame[0] = index;
                jQuery('div.timeline-grid-row-cell[id =' + index + ']', div).addClass('special');
            }
            else if (frame.length == 1){
                if (frame[0]<index){
                    frame[1]=index++;
                    for (var i=frame[0]; i<=frame[1]; i++)
                        jQuery('div.timeline-grid-row-cell[id =' + i + ']', div).addClass('special');
                }
                else {
                    frame[1]=frame[0];frame[0]=index;
                    for (var i=frame[0]; i<=frame[1]; i++)
                        jQuery('div.timeline-grid-row-cell[id =' + i + ']', div).addClass('special');
                }
            }
            else {
                deselectAllColumn();
                frame=[];frame[0]=index;
                jQuery('div.timeline-grid-row-cell[id =' + index + ']', div).addClass('special');
            }
        }

        function deselectColumn (index){
            index = parseInt(index);
            if(frame.length==1){
                frame=[];
                jQuery('div.timeline-grid-row-cell[id =' + index + ']', div).removeClass('special');
            }
            else{
                if (frame[0]==index) {
                    for(var i=frame[0];i<=frame[1]-1;i++)
                        jQuery('div.timeline-grid-row-cell[id =' + i + ']', div).removeClass('special');
                    var temp=frame[1]; frame=[]; frame[0]=temp;
                }
                else{
                    for(var i=frame[1]+1;i>=frame[0]+1;i--)
                        jQuery('div.timeline-grid-row-cell[id =' + i + ']', div).removeClass('special');
                    var temp=frame[0]; frame=[]; frame[0]=temp;
                }
            }
        }

        function deselectAllColumn(){
            for (var i=frame[0]; i<=frame[1]+1; i++)
                jQuery('div.timeline-grid-row-cell[id =' + i + ']', div).removeClass('special');
            jQuery('div.timeline-hzheader-sec[id = 1]', div).removeClass('special');
            jQuery('div.timeline-hzheader-sec[id = 1]', div).attr('id','0'); 
        }

        function ActorSelection(data, callback, callback2){
            $(":checkbox").change(function(){
                
                if($(this).attr("checked"))
                {
                    var id_check = jQuery(this).attr('id');
                    jQuery('div.timeline-vtheader-item[id='+id_check+']', div).attr('hide',true);
                    if (callback) { callback(data[id_check].id); }
                }
                else
                {   var id_check = jQuery(this).attr('id');
                    jQuery('div.timeline-vtheader-item[id='+id_check+']', div).attr('hide',false);
                    if (callback2) { callback2(data[id_check].id); }
                }

            });
        }

        return {
        	apply: apply	
        };
	}

    jQuery.fn.del = function () {
        var container = jQuery(this);
        container.unbind();
        container.children().remove();
    };
    

})(jQuery);
