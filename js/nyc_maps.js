/**
 * http://usejsdoc.org/
 */

var color = d3.scale.linear()
	   .domain([0,10])  // min/max of data
	   .range(["#00cc00", "#cc0000"])
	   .interpolate(d3.interpolateHcl) ;

var id_roads_list = []
var id_zipcodes_list = []

$(document).ready(function () {

	queue().defer(d3.json, '/resources/nyc_area.min.topojson')
		.defer(d3.json, '/resources/nyc_boundaries.min.topojson')
		.defer(d3.json, '/resources/nyc_road_internal_name_not_null.min.topojson')
		.await(makeRoadsMap);
	
	queue().defer(d3.json, '/resources/nyc_area.min.topojson')
		.defer(d3.json, '/resources/nyc_boundaries.min.topojson')
		.defer(d3.json, '/resources/nyc_zipcode.min.topojson')
		.await(makeZipCodesMap);
});

function setColor(reference_element, style_property, value, border_darker){
	value = color(Math.floor(Math.random() * 10) + 1 )
	$(reference_element).css(style_property,value)
	if (border_darker == true){
		$(reference_element).css("stroke",d3.rgb(value).darker(1))
	}
}

function makeRoadsMap(error, area, nyc, streets) {
	
	var svg = d3.select("#nycMapRoutes")
		.call(d3.behavior.zoom().on("zoom", function () {
			svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")}))
			.on("dblclick.zoom", null) 
			.append("g");

	var projection = d3.geo.mercator()
						.center([-74.00, 40.75])
						.scale(68000);
	
	var path = d3.geo.path().projection(projection);
	svg.append('path')
		.datum(topojson.feature(area, area.objects.collection))
			.attr('d', path)
			.attr('class', 'area');
	svg.append('path')
		.datum(topojson.feature(nyc, nyc.objects.collection))
			.attr('d', path)
			.attr('class', 'nyc');
	
	svg.selectAll("path")
	   .data(topojson.feature(streets, streets.objects.collection).features)
	   .enter()
	   .append("path")
	   .attr('d', path)
	   .attr('class', 'street')
	   .attr('id', function(el){
		   var id = "nyc_street_"+el.properties.id;
		   id_roads_list.push(id);
		   return id
		   });
	
	id_roads_list.forEach(function(element, i, array) {
		setColor("#"+element,"stroke",0,false)
	})
}

function makeZipCodesMap(error, area, nyc, streets) {
	
	var svg = d3.select("#nycMapZipCodes")
		.call(d3.behavior.zoom().on("zoom", function () {
			svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")}))
			.on("dblclick.zoom", null) 
			.append("g");

	var projection = d3.geo.mercator()
						.center([-74.00, 40.75])
						.scale(68000);
	
	var path = d3.geo.path().projection(projection);
	svg.append('path')
		.datum(topojson.feature(area, area.objects.collection))
			.attr('d', path)
			.attr('class', 'area');
	svg.append('path')
		.datum(topojson.feature(nyc, nyc.objects.collection))
			.attr('d', path)
			.attr('class', 'nyc');
	
	svg.selectAll("path")
	   .data(topojson.feature(streets, streets.objects.collection).features)
	   .enter()
	   .append("path")
	   .attr('d', path)
	   .attr('class', 'zipcode')
	   .attr('id', function(el){
		   console.log(el)
		   var id = "nyc_zip_code_"+el.properties.p;
		   id_zipcodes_list.push(id);
		   return id
		   });
	
	id_zipcodes_list.forEach(function(element, i, array) {
		setColor("#"+element,"fill",0,true)
	})
}