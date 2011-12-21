$(document).ready(function() {
	/* constants */
	var showYear = 2012;
	var table_tmpl = $('#table_tmpl').html()

	cat_whitelist = ['Architecture', 'Design', 'Design festivals', 'Dance', 'Dance festivals', 'Theatre', 'Theatre festivals', 'New media art', 'Visual arts', 'Visual arts festivals', 'Film', 'Literature', 'Literature festivals', 'Music', 'Intangible heritage', 'Multidisciplinary festivals']
	var c = 0;
	d3.json("data.json", function(json){
		json.items.map(function(item){
	// d3.json("ba-simple-proxy.php?url=http://www.culture.si/en/Special:Ask/-5B-5BCategory:Festivals-5D-5D-0A-5B-5BCategory:NODEPO-5D-5D/-3FFrequency/-3FOrganised-20by/-3FWebsite/-3FEmail/-3FTelephone/-3FStreet/-3FTown/-3FDuration_weeks/-3FCategory/format%3Djson/sep%3D,/headers%3Dshow/limit%3D500", function(json){
	// 	json.contents.items.map(function(item){			
			c+=1; item.id = c;
			var cats = item.category;
			item.category = [];
			for (var i = cats.length - 1; i >= 0; i--) {
				if (cat_whitelist.indexOf(cats[i]) >= 0) {
					item.category.push(cats[i])
				}
			};
			item.category = item.category.join(', ')

			item.parsed_weeks = getDurationWeeks(item);
			$('.data').append($.tmpl(table_tmpl, item));

		});
	});

	function getDurationWeeks(item) {
		if (item.duration_weeks !== undefined) {
			var arr = item.duration_weeks.split(")");
			for (var i = arr.length - 1; i >= 0; i--) {
				var res = arr[i].match(/[0-9]+/g);
				if (res === null) { continue };
				var weeks = res.slice(0, -1);
				var year = parseInt(res.slice(-1));

				if (showYear === year) {
					return weeks.join(', ')
				};
			};
		}
		return '';
	}

});