(function (jQuery) {
	
    jQuery.fn.Timeline = function () {
    	
    	var args = Array.prototype.slice.call(arguments);
    	
    	if (args.length == 1 && typeof(args[0]) == "object") {
        	build.call(this, args[0]);
    	}
    	
    	if (args.length == 2 && typeof(args[0]) == "string") {
    		handleMethod.call(this, args[0], args[1]);
    	}
    };
    
    function build(options) {
    	
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
        
        var opts = jQuery.extend(true, defaults, options);

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
                var itemDiv = jQuery("<div>", { "class": "timeline-vtheader-item" });
                itemDiv.append(jQuery("<div>", {
                    "class": "timeline-vtheader-item-name",
                    "css": { "height": cellHeight + "px" }
                }).append(data[i].name)); //nome/tipo attore
                headerDiv.append(itemDiv);
            }
            div.append(headerDiv);
        }

        function addHzHeader(div, times, cellWidth) {
          
            var monthsDiv = jQuery("<div>", { "class": "timeline-hzheader-months" }); //minuti
            var daysDiv = jQuery("<div>", { "class": "timeline-hzheader-days" }); //secondi
            var totalW = 0;
            var w = times.length * cellWidth;
            totalW = totalW + w;
            monthsDiv.append(jQuery("<div>", {
                        "class": "timeline-hzheader-month",
                        "css": { "width": (w - 1) + "px" }
            }));
            for (var y in times) {
                        daysDiv.append(jQuery("<div>", { "class": "timeline-hzheader-day" }).append(times[y]));                
            }
            monthsDiv.css("width", totalW + "px");
            daysDiv.css("width", totalW + "px");
            div.append(monthsDiv.append(daysDiv));
        }

        function addGrid(div, data, times, cellWidth) {
            var gridDiv = jQuery("<div>", { "class": "timeline-grid" });
            var rowDiv = jQuery("<div>", { "class": "timeline-grid-row" });
			for (var y in times) {
                var cellDiv = jQuery("<div>", { "class": "timeline-grid-row-cell" });
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
                    var size = series.end - series.start +1;
					var offset = series.start - start;
                    var block = jQuery("<div>", {
                        "class": "timeline-block",
                        "title": series.title ? series.title : series.name + ", " + size + " seconds",
                        "css": {
                            "width": ((size * cellWidth) - 9) + "px",
                            "left": ((offset * cellWidth) + 3) + "px"
                        }
                    });
                    addBlockData(block, data[i], series);
                    if (data[i].series[j].color) {
                        block.css("background-color", data[i].series[j].color);
                    }
					if (data[i].series[j].cssClass) {
                        block.addClass(data[i].series[j].cssClass);
                    }
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
            jQuery("div.timeline-hzheader-days div.timeline-hzheader-day:last-child", div).addClass("last");
            jQuery("div.timeline-hzheader-months div.timeline-hzheader-month:last-child", div).addClass("last");
        }
		
		return {
			render: render
		};
	}

	var Behavior = function (div, opts) {
		
		function apply() {
            bindBlockEvent(div, "mouseover", opts.behavior.onMouseOver);
            bindBlockEvent(div, "mouseout", opts.behavior.onMouseOut);

			if (opts.behavior.clickable) { 
            	bindBlockEvent(div, "click", opts.behavior.onClick);
        	}

		}

        function bindBlockEvent(div, eventName, callback) {
            jQuery("div.timeline-block", div).live(eventName, function () {
                if (callback) { callback(jQuery(this).data("block-data"), this); }
            });
        }
        
    
        return {
        	apply: apply	
        };
	}


})(jQuery);
