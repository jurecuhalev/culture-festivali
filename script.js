$(document).ready(function() {
	/* constants */
	var showYear = 2012;
	var months = [['January', 4], ['February', 4], ['March', 5], ['April', 4], ['May', 4], ['June', 5], 
				  ['July', 4], ['August', 5], ['September', 4], ['October', 4], ['November', 5], ['December', 4]
	]
	var festivals = []
	/* load and parse data */
	var data = d3.range(1,53).map(function(){ return {"count":0, "items": []}; } );
	var c = 0;
	// d3.json("../data.json", function(json){
	d3.json("/en/Special:Ask/-5B-5BCategory:Festivals-5D-5D-0A-5B-5BCategory:NODEPO-5D-5D/-3FFrequency/-3FOrganised-20by/-3FWebsite/-3FEmail/-3FTelephone/-3FStreet/-3FTown/-3FDuration_weeks/-3FCategory/format%3Djson/sep%3D,/headers%3Dshow/limit%3D500", function(json){
		json.items.map(function(item){
	// d3.json("ba-simple-proxy.php?url=http://www.culture.si/en/Special:Ask/-5B-5BCategory:Festivals-5D-5D-0A-5B-5BCategory:NODEPO-5D-5D/-3FFrequency/-3FOrganised-20by/-3FWebsite/-3FEmail/-3FTelephone/-3FStreet/-3FTown/-3FDuration_weeks/-3FCategory/format%3Djson/sep%3D,/headers%3Dshow/limit%3D500", function(json){
	// 	json.contents.items.map(function(item){
			if (item.duration_weeks !== undefined) {
				var arr = item.duration_weeks.split(")");
				for (var i = arr.length - 1; i >= 0; i--) {
					var res = arr[i].match(/[0-9]+/g);
					if (res === null) { continue };
					var weeks = res.slice(0, -1);
					var year = parseInt(res.slice(-1));

					if (showYear === year) {
						c += 1; item.id = c;
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
				.style('width', function(d){ return d[1]*15-1+'px' })
				.text(function(d){ return d[0] })

		/* render after we load json with data */
		var chart = d3.select(".container")
		 	.insert("div", '.legend')
		 		.attr("class", "chart")
		 		.style("height", "320px")

		var max_items = d3.max(data.map(function(item){ return item.count }))

		var div = chart.selectAll("div")
	     	.data(data)
		   		.enter().append("div")
		   		.attr("class", "col")
	     		.style("width", "13px")
	     		.style('min-height', '10px')
	     		.style('padding-top', function(d, i) { return ((max_items - d.count) * 14) + 'px';})
	   
		div.selectAll("div")
			.data(function(d){ return d.items.reverse(); })
			.enter().append("div")
				.attr("class", "box")
				.style("background-color", colorpicker)
	     	.on("click", click)
	     	.on("mouseover", showTitle)
	     	.on("mouseout", function(){ $('#short_description').empty(); })

	    // div.append("div")
	    // 	.attr("class", "number")
	    // 	.text(function(d){ return d.count })
	    	
	});
		
	/* events */
	_.templateSettings = {
  		interpolate : /\{(.+?)\}/g
	};

	var short_tmpl = _.template('<h4 class="title">{label} ({merged_cat})</h4>');
	var description = _.template('<h3 class="title"><a href="{uri}"}>{label}</a></h3>'+
  					'<ul><li><strong>Organised by:</strong> {organised_by}</li>'+
      				'<li><strong>Frequency:</strong> {frequency}</li>'+
      				'<li><strong>Web site:</strong> <a href="{website}">{website}</a> </li></ul>')
	
	function showTitle(d, i) {
		$('#short_description').empty();
		$('#short_description').html(short_tmpl(d));
	}

	function click(d, i) {
		_.defaults(d, {organised_by:'', frequency:'', website:''})
		$('#description').empty();
		$('#description').append(description(d));
	}
	

	function colorpicker(d) {
		//if (d.color !== undefined){ return color; }

		var cat = d.category;
		var c = 0;
		var color = 'pink';
		var merged_cat = 'Other'
		
		if  (cat.indexOf('Architecture festivals') >= 0 || cat.indexOf('Design festivals') >= 0) {
			color = '#609B18'; c += 1;
			merged_cat = 'Architecture & Design';
		} 
		if (cat.indexOf('Dance festivals') >= 0 || cat.indexOf('Theatre festivals') >= 0) {
			color = '#547980'; c += 1;
			merged_cat = 'Theater &amp; Dance';
		} 
		if (cat.indexOf('New media art festivals') >= 0 || cat.indexOf('Visual arts festivals') >= 0) {
			color = '#45ADA8'; c += 1;
			merged_cat = 'New media &amp; Visual arts';
		} 
		if (cat.indexOf('Film festivals') >= 0) {
			color = '#9DE0AD'; c+= 1;
			merged_cat = 'Film';
		} 
		if (cat.indexOf('Literature festivals') >= 0) {
			color = '#547980'; c+= 1;
			merged_cat = 'Literature';
		} 
		if (cat.indexOf('Music festivals') >= 0) {
			color = '#B6092A'; c+= 1;
			merged_cat = 'Music';
		} 
		if (cat.indexOf('Intangible heritage festivals') >= 0) {
			color = '#FF9F80'; c += 1;
			merged_cat = 'Intangible heritage';
		} 
		if (cat.indexOf('Multidisciplinary festivals') >= 0) {
			color = 'navyblue'; c = 0;
			merged_cat = 'Multidisciplinary festivals';
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
