$(document).ready(function() {
	/* constants */
	var showYear = 2012;

	/* load and parse data */
	var data = d3.range(0,53).map(function(){ return {"count":0, "items": []}; } );

	d3.json("data.json", function(json){
		json.items.map(function(item){
	// d3.json("ba-simple-proxy.php?url='http://www.culture.si/en/Special:Ask/-5B-5BCategory:Festivals-5D-5D-0A-5B-5BCategory:NODEPO-5D-5D/-3FFrequency/-3FOrganised-20by/-3FWebsite/-3FEmail/-3FTelephone/-3FStreet/-3FTown/-3FDuration_weeks/-3FCategory/format%3Djson/sep%3D,/headers%3Dshow/limit%3D500'", function(json){
	// 	json.contents.items.map(function(item){
			if (item.duration_weeks !== undefined) {
				var arr = item.duration_weeks.split(")");
				for (var i = arr.length - 1; i >= 0; i--) {
					var res = arr[i].match(/[0-9]+/g);
					if (res === null) { continue };
					var weeks = res.slice(0, -1);
					var year = parseInt(res.slice(-1));

					if (showYear === year) {
						for (var i = weeks.length - 1; i >= 0; i--) {
							var week = parseInt(weeks[i]);
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
				console.log(a.label, b.label, a.merged_cat, b.merged_cat, a.merged_cat > b.merged_cat)
				return a.merged_cat > b.merged_cat; 
			});
		})

		/* render after we load json with data */
		var chart = d3.select(".container")
		 	.insert("div", '#description')
		 		.attr("class", "chart");

		var div = chart.selectAll("div")
	     	.data(data)
		   		.enter().append("div")
	     		.style("width", "15px")

		div.selectAll("div")
			.data(function(d){ return d.items })
			.enter().append("div")
				.attr("class", "box")
				.style("background-color", colorpicker)
	     	.on("click", click)

	    div.append("div")
	    	.attr("class", "number")
	    	.text(function(d){ return d.count })
	    	.height("15px").exit();
	});
		
	/* events */
	var template = $('#description_tmpl').html();

	function click(d, i) {
		$('#description').empty();
		$('#description').append($.tmpl(template, d));
	}

	function colorpicker(d) {
		var cat = d.category;
		var c = 0;
		var color = 'steelblue';
		var merged_cat = 'undefined'
		if 		  (cat.indexOf('Architecture') >= 0 || cat.indexOf('Design') >= 0 || cat.indexOf('Design festivals') >= 0) {
			color = '#594F4F'; c += 1;
			merged_cat = 'Architecture & Design';
		} else if (cat.indexOf('Dance') >= 0 || cat.indexOf('Dance festivals') >= 0 || cat.indexOf('Theatre') >= 0 || cat.indexOf('Theatre festivals') >= 0) {
			color = '#547980'; c += 1;
			merged_cat = 'Theather & Dance';
		} else if (cat.indexOf('New media art') >= 0 || cat.indexOf('Visual arts') >= 0 || cat.indexOf('Visual arts festivals') >= 0) {
			color = '#45ADA8'; c += 1;
			merged_cat = 'New media & Visual arts';
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
		return color;
	}

});









