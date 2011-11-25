$(document).ready(function() {
	/* constants */
	var showYear = 2012;
	var months = [['January', 5], ['February', 4], ['March', 4], ['April', 5], ['May', 4], ['June', 4], 
				  ['July', 5], ['August', 4], ['September', 4], ['October', 5], ['November', 4], ['December', 4]
	]

	/* load and parse data */
	var data = d3.range(1,53).map(function(){ return {"count":0, "items": []}; } );

	// d3.json("data.json", function(json){
	// 	json.items.map(function(item){
	d3.json("ba-simple-proxy.php?url=http://www.culture.si/en/Special:Ask/-5B-5BCategory:Festivals-5D-5D-0A-5B-5BCategory:NODEPO-5D-5D/-3FFrequency/-3FOrganised-20by/-3FWebsite/-3FEmail/-3FTelephone/-3FStreet/-3FTown/-3FDuration_weeks/-3FCategory/format%3Djson/sep%3D,/headers%3Dshow/limit%3D500", function(json){
		json.contents.items.map(function(item){
			if (item.duration_weeks !== undefined) {
				var arr = item.duration_weeks.split(")");
				for (var i = arr.length - 1; i >= 0; i--) {
					var res = arr[i].match(/[0-9]+/g);
					if (res === null) { continue };
					var weeks = res.slice(0, -1);
					var year = parseInt(res.slice(-1));

					if (showYear === year) {
						for (var i = weeks.length - 1; i >= 0; i--) {
							var week = parseInt(weeks[i])-1;
							data[week].count += 1;
							var ref = data[week].items.push(item);
							colorpicker(data[week].items[ref-1]);
						};
					};
				};
			}
		});

		data.map(function(item){
			item.items = item.items.sort(function(a,b){ 
				if (a.color > b.color) {return 1 }
				else if (a.color < b.color) { return -1 }
				return 0; 
			});			
		})

		var legend = d3.select(".legend").selectAll('span')
			.data(months)
				.enter().append('span')
				.style('width', function(d){ return d[1]*17-1+'px' })
				.text(function(d){ return d[0] })

		/* render after we load json with data */
		var chart = d3.select(".container")
		 	.insert("div", '#description')
		 		.attr("class", "chart");

		var div = chart.selectAll("div")
	     	.data(data)
		   		.enter().append("div")
	     		.style("width", "15px")
	     		.style('min-height', '10px')

		div.selectAll("div")
			.data(function(d){ return d.items })
			.enter().append("div")
				.attr("class", "box")
				.style("background-color", colorpicker)
	     	.on("click", click)
	     	.on("mouseover", showTitle)
	     	.on("mouseleave", function(){ $('#description').empty(); })

	    // div.append("div")
	    // 	.attr("class", "number")
	    // 	.text(function(d){ return d.count })
	    	
	});
		
	/* events */
	var template = $('#description_tmpl').html();
	var short_tmpl = $('#short_tmpl').html();

	function showTitle(d, i) {
		$('#short_description').empty();
		$('#short_description').append($.tmpl(short_tmpl, d))
	}

	function click(d, i) {
		$('#description').empty();
		$('#description').append($.tmpl(template, d));
	}

	function colorpicker(d) {
		//if (d.color !== undefined){ return color; }

		var cat = d.category;
		var c = 0;
		var color = 'steelblue';
		var merged_cat = 'Other'
		if 		  (cat.indexOf('Architecture') >= 0 || cat.indexOf('Design') >= 0 || cat.indexOf('Design festivals') >= 0) {
			color = '#594F4F'; c += 1;
			merged_cat = 'Architecture & Design';
		} else if (cat.indexOf('Dance') >= 0 || cat.indexOf('Dance festivals') >= 0 || cat.indexOf('Theatre') >= 0 || cat.indexOf('Theatre festivals') >= 0) {
			color = '#547980'; c += 1;
			merged_cat = 'Theather &amp; Dance';
		} else if (cat.indexOf('New media art') >= 0 || cat.indexOf('Visual arts') >= 0 || cat.indexOf('Visual arts festivals') >= 0) {
			color = '#45ADA8'; c += 1;
			merged_cat = 'New media &amp; Visual arts';
		} else if (cat.indexOf('Film') >= 0) {
			color = '#9DE0AD'; c+= 1;
			merged_cat = 'Film';
		} else if (cat.indexOf('Literature') >= 0 || cat.indexOf('Literature festivals') >= 0) {
			color = '#E5FCC2'; c+= 1;
			merged_cat = 'Literature';
		} else if (cat.indexOf('Music') >= 0) {
			color = '#B6092A'; c+= 1;
			merged_cat = 'Music';
		} else if (cat.indexOf('Intangible heritage') >= 0) {
			color = '#FF9F80'; c+= 1;
			merged_cat = 'Intangible heritage';
		}

		if (c > 1) {
			color = '#F1BBBA';
			merged_cat = 'Combined';
		} 
		d.merged_cat = merged_cat;
		d.color = color;
		return color;
	}

});









