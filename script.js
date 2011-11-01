$(document).ready(function() {
	/* constants */
	var showYear = 2012;

	/* load and parse data */
	var data = d3.range(0,53).map(function(){ return {"count":0, "items": []}; } );

	d3.json("data.json", function(json){
	//d3.json("ba-simple-proxy.php?url=http://www.culture.si/en/Special:Ask/-5B-5BCategory:Festivals-5D-5D-0A-5B-5BCategory:INFOBOX_DONE-5D-5D/-3FFrequency/-3FOrganised-20by/-3FWebsite/-3FEmail/-3FTelephone/-3FStreet/-3FTown/-3FDuration_weeks/format%3Djson/sep%3D,/headers%3Dshow/limit%3D500", function(json){
		json.items.map(function(item){
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
							data[week].items.push(item);
						};
					};
				};
			}
		});

		/* render after we load json with data */

		var y = d3.scale.linear()
			.domain([0, d3.max( data.map(function(d){ return d.count; }))])
			// .domain([0, 20])
		 	.range(["0px", "300px"]);

		var chart = d3.select(".container")
		 	.insert("div", '#description')
		 		.attr("class", "chart");

		chart.selectAll("div")
	     	.data(data)
	   		.enter().append("div")
	     	.style("height", function(d,i) { return y(d.count); })
	     	.style("width", "1%")
	     	.text(function(d) { return d.count; })
	     	.on("click", click)

	});
		
	/* events */
	var template = $('#description_tmpl').html();

	function click(d, i) {
		$('#description').empty();
		for (var i = d.items.length - 1; i >= 0; i--) {
			var item = d.items[i]
			$('#description').append($.tmpl(template, item))
		};
		
	}

});









