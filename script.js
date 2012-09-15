$(document).ready(function() {
	function addWeek(date) {
		return new Date(date.getTime() + 24 * 60 * 60 * 1000 * 7);
	}
	function y2k(number) { return (number < 1000) ? number + 1900 : number; }
	function getWeek(year,month,day) {
	    var when = new Date(year,month,day);
	    var newYear = new Date(year,0,1);
	    var modDay = newYear.getDay();
	    if (modDay == 0) modDay=6; else modDay--;

	    var daynum = ((Date.UTC(y2k(year),when.getMonth(),when.getDate(),0,0,0) -
	                 Date.UTC(y2k(year),0,1,0,0,0)) /1000/60/60/24) + 1;

	    if (modDay < 4 ) {
	        var weeknum = Math.floor((daynum+modDay-1)/7)+1;
	    }
	    else {
	        var weeknum = Math.floor((daynum+modDay-1)/7);
	        if (weeknum == 0) {
	            year--;
	            var prevNewYear = new Date(year,0,1);
	            var prevmodDay = prevNewYear.getDay();
	            if (prevmodDay == 0) prevmodDay = 6; else prevmodDay--;
	            if (prevmodDay < 4) weeknum = 53; else weeknum = 52;
	        }
	    }

	    return + weeknum;
	}

	/* constants */
	var showYear = 2012;
	var months = [['January', 4], ['February', 4], ['March', 5], ['April', 4], ['May', 4], ['June', 5], 
				  ['July', 4], ['August', 5], ['September', 4], ['October', 4], ['November', 5], ['December', 4]
	]
	var festivals = []
	/* load and parse data */
	var data = d3.range(1,53).map(function(){ return {"count":0, "items": []}; } );
	var c = 0;
	d3.json("epk2012.json", function(json){
		json.map(function(item){
			if (item.start !== undefined) {
				if (_.include(item.tags, '000113893'))  {
					item.lent = true;
				}


				var start_date = new Date(Date.parse(item.start));
				var end_date = new Date(Date.parse(item.end));

			 	var start_week = getWeek(y2k(start_date.getYear()),start_date.getMonth(),start_date.getDate());
			 	var weeks = [start_week];

			 	// commented out as we currently want only beginnings of events
			 	// var cur_date = start_date;
			 	// while (cur_date < end_date) {
			 	// 	var cur_week =  getWeek(y2k(cur_date.getYear()),cur_date.getMonth(),cur_date.getDate());
			 	// 	if (_.include(weeks, cur_week) !== true) {
			 	// 		weeks.push(cur_week);	
			 	// 	};
			 	// 	cur_date = addWeek(cur_date);
			 	// }

				var year = 2012;
				if (showYear === year) {
					c += 1; item.id = c;
					for (var i = weeks.length - 1; i >= 0; i--) {
						var week = parseInt(weeks[i])-1;
						data[week].count += 1;
						var ref = data[week].items.push(item);
						colorpicker(data[week].items[ref-1]);
					};
				};
			}
		});

		data.map(function(item){
			item.items = item.items.sort(function(a,b){ 
				if (a.sort_order > b.sort_order) {return 1 }
				else if (a.sort_order < b.sort_order) { return -1 }
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
	     		.style('float', 'left')
	     		.style('padding-top', function(d, i) { return ((max_items - d.count) * 14) + 'px';})
	   
		div.selectAll("div")
			.data(function(d){ return d.items.reverse(); })
			.enter().append("div")
				.attr("class", function(item){
					if (item.lent) { return "box lent" };
					return "box"
					})
				.style("background-color", colorpicker)
	     	.on("click", click)
	     	.on("mouseover", showTitle)
	     	.on("mouseout", function(){ $('#short_description').empty(); })	    	
	});
		
	/* events */
	_.templateSettings = {
  		interpolate : /\{(.+?)\}/g
	};

	var short_tmpl = _.template('<h4 class="title">{title} ({types})</h4>');
	var description = _.template('<h3 class="title">{title}</h3>'+
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

		var cat = d.types;
		var c = 0;
		var color = 'pink';
		var merged_cat = 'Other'
		
		if  (cat.indexOf('exhibitions') >= 0) {
			color = '#978b78'; c += 1;
			merged_cat = 'Exhibitions';
			so = 2;
		} 
		if (cat.indexOf('music') >= 0) {
			color = '#995545'; c += 1;
			merged_cat = 'Music';
			so = 1;
		} 
		if (cat.indexOf('literature') >= 0) {
			color = '#31423f'; c += 1;
			merged_cat = 'Literature';
			so = 0;
		} 
		if (cat.indexOf('film') >= 0) {
			color = '#719177'; c+= 1;
			merged_cat = 'Film';
			so = 5;
		} 
		if (cat.indexOf('theatre') >= 0) {
			color = '#82b8be'; c+= 1;
			merged_cat = 'Theatre';
			so = 3;
		} 
		if (cat.indexOf('city') >= 0) {
			color = '#72773a'; c+= 1;
			merged_cat = 'City';
			so = 6;
		} 
		if (cat.indexOf('architecture') >= 0) {
			color = '#ae933b'; c += 1;
			merged_cat = 'Architecture';
			so = 4;
		} 
		if (cat.indexOf('community') >= 0) {
			color = '#526768'; c = 0;
			merged_cat = 'Community';
			so = 8;
		}

		if (cat.indexOf('child') >= 0) {
			color = '#0E1961'; c = 0;
			merged_cat = 'Children';
			so = 9;
		}
		if (cat.indexOf('knowledge') >= 0) {
			color = '#FADA6E'; c = 0;
			merged_cat = 'Knowledge';
			so = 10;
		}
		if (cat.indexOf('intermedia') >= 0) {
			color = '#36A5E1'; c = 0;
			merged_cat = 'Intermedia';
			so = 11;
		}


		// if (c > 1) {
		// 	color = '#F1BBBA';
		// 	merged_cat = 'Combined';
		// 	sort_order = 99;
		// } 
		// console.log($('.'+color).length);
		if ($('.'+color.substring(1)).length === 0) {
			$('.colors').append('<li class="'+color.substring(1)+'" style="border-left: 20px solid '+color+'">'+merged_cat+'</li>');
		}

		d.merged_cat = merged_cat;
		d.color = color;
		d.sort_order = so;
		return color;
	}

});
