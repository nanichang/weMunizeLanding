var loadSvgMap = function(paths, Categories, LgaData, Colors){
    var numberWithCommas = function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    var escapeHTML = function(s) {
        var elem = document.createElement("SPAN");
        elem.appendChild(document.createTextNode(s));
        return elem.innerHTML;
    }
    
    var getResult = function(lgatitle, singleLga) {		
        var toolTip = "<h3><span>" + escapeHTML(lgatitle) + "</span></h3><ul>";
        for (var j = 0; j < singleLga['values'].length; j++) {
            toolTip += "<li>" + escapeHTML(Categories[j]) + " <span>" + numberWithCommas(singleLga['values'][j]) +"</span></li>";
        }
        
        toolTip += "</ul>" ;
        
        return {
            ktoolTip: toolTip,
			hasResult: true, 			
            partycode: Colors[singleLga['color']]
        };
        
    };

	var mapWidth = 700;
	var mapHeight = 500;
	var maxX = 0, maxY = 0, minX = 0, minY = 0;
	var mapData = {};

	for (j in paths) {
		var data = paths[j];

		var dsplit = data.split(' ');

		for (var i = 0; i < dsplit.length; i++) {
			var coords = dsplit[i].split(',');
			coords[0] = parseFloat(coords[0]);
			coords[1] = parseFloat(coords[1]);
			if (coords[0] > maxX) maxX = coords[0];
			if (coords[1] > maxY) maxY = coords[1];
			
			if (coords[0] < minX || minX == 0) minX = coords[0];
			if (coords[1] < minY || minY == 0) minY = coords[1];
		}
	}

	var srcWidth = maxX - minX;
	var srcHeight = maxY - minY;
	var ratio = Math.min(mapWidth / srcWidth, mapHeight / srcHeight);
	//alert(mapWidth / srcWidth + " " + mapHeight / srcHeight);
	//4.68846422385009 2.5319070931883596 borno tall
	//8.534725954562964 26.48108720751633 lagos wide
	var tallestPoint = 0;
	for (j in paths) {
		var data = paths[j];

		var dsplit = data.split(' ');

		for (var i = 0; i < dsplit.length; i++) {
			var coords = dsplit[i].split(',');
			coords[0] = parseFloat(coords[0]);
			coords[1] = parseFloat(coords[1]);
			coords[0] -= minX;
			coords[1] -= minY;
			
			//coords[0] *= mapWidth / (maxX - minX);
			//coords[1] *= mapHeight / (maxY - minY);
			
			coords[0] *= ratio;
			coords[1] *= ratio;
			if (coords[1] > tallestPoint) tallestPoint = coords[1];
			
			dsplit[i] = (i == 0 ? 'M' : 'L') + coords.join(',');
		}
		
		mapData[j] = dsplit.join(' ') + 'Z';
	}
	paths = mapData;

	
    /* Raphael stuff here */
    var r = Raphael('map', mapWidth, tallestPoint),
    attributes = {
        fill: "#F5F5F5",
        stroke: '#000',
        'stroke-width': 1,
        'stroke-linejoin': 'round'
    },



    arr = new Array();


    //r.setViewBox(50, 200, 950, 300, true);

    for (var region in paths) {
        var obj = r.path(paths[region]);
        arr[obj.id] = region;
        //var data = paths[arr[obj.id]];
		 //var titleText = {ktoolTip: region};
         var titleText = getResult(region, LgaData[region]);
			
        //attributes.title = titleText ;
           
        /*$(obj.node).qtip();*/
        if(titleText.hasResult){
            var colorcode = titleText.partycode;
            //obj.attr(attributes);
            obj.attr({
                fill: colorcode,
                stroke: '#000',
                'stroke-width': 1,
                'stroke-linejoin': 'round'
            });
			
            obj["cool"] = colorcode;
			
			/*
            obj
            //on mouse over event
            .hover(function() {

                this.animate({
                    fill: '#27ae60'
                }, 300);


            }, function() {
                console.log(this);
                this.animate({
                    fill: this.cool
                }, 300);
            });
			*/
			
            //console.log(titleText.ktoolTip);
	
            //$(obj.node).smallipop({}, 'This is my special hint');
            	
        }
        else
        {
            obj.attr(attributes);
            //attributes2.fill = attributes.fill;
            obj
            //on mouse over event
            .hover(function() {

                this.animate({
                    fill: '#676768'
                }, 300);


            }, function() {
                this.animate({
                    fill: attributes.fill
                }, 300);
            });
        }

		$(obj.node).qtip({
			style: {
				classes: 'smallipop-instance smallipop-theme-default smallipop-align-right smallipop-bottom'
			},
			events: {
				show: function(event, api) {
					$('.qtip-content').addClass('smallipop-content');
				}
			},
			content: {
				text: titleText.ktoolTip
			},
			position: {
				my: 'top left',
				at: 'bottom left'
			},
			hide: {
				fixed: true
			}
		});



		/*
        obj
        // on click event
        .click(function() {
            var data = paths[arr[this.id]];
            var result = getResult(data.code,data.title);
        //console.log(result);
        });
		*/
    }
};