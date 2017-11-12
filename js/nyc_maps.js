
var kpi_list = []
var server_host="http://localhost:8888/"
	
	
var projection ;


$(document).ready(function(){
	var options={
		format: 'dd/mm/yyyy',
		todayHighlight: true,
		autoclose: true
	};
	  
	$('#street_date_to,#street_date_from').datepicker(options);
	$('#street_date_to').datepicker('update', new Date());
	
	$('#street_date_from').datepicker('update', new Date(2017,0,1,0,0,0));
	$("#street_apply,#street_kpi_list,#street_scale_list").prop('disabled', true);
	$("#street_apply").on("click",function(){
		$("#street_apply,#street_kpi_list,#street_scale_list").prop('disabled', true);
		$("#street_loader").slideDown();
		postRequest("crash_by_street",{},mapStreetCallback)
	})
	  
	postRequest("dashboardsParameters",{},dahboardParams)
	
	projection = d3.geo.mercator()
					.center([-73.9, 40.755])
					.scale(67000);
	  
	queue()
		.defer(d3.json, 'resources/nyc_area.min.topojson')
		.defer(d3.json, 'resources/nyc_boundaries.min.topojson')
		.defer(d3.json, 'resources/nyc_road_internal_name_not_null.min.topojson')
		.await(drawStreetMap);

})


function postRequest(service,data,callback){
	$.ajax({  
        type: "POST",  
        url: server_host+service,  
        data: data,  
        success: callback
    });  
}

function dahboardParams(data){	
	$.each(data.kpi_list, function (index, value) {
	    $('#street_kpi_list').append($('<option/>', { 
	        value: value,
	        text : (value+"").replace("_"," ").replace(/\b\w+/g,function(s){return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();})
	    }));
	    if(value == "crash"){
	    		$('#street_kpi_list').val(value)
	    }
	});  
	
	$.each(data.scale_list, function (index, value) {
	    $('#street_scale_list').append($('<option/>', { 
	        value: value,
	        text : (value+"").replace("_"," ").replace(/\b\w+/g,function(s){return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();})
	    }));
	    if(value == "logaritmic"){
	    		$('#street_scale_list').val(value)
	    }
	});  
}

function drawStreetMap(err,area,boundaries,streets){
	
	var svg = d3.select('#street_map')
	 
	var path = d3.geo.path()
		.projection(projection);
		
	svg.append('path')
		.datum(topojson.feature(area, area.objects.collection))
			.attr('d', path)
			.attr('class', 'area');
	
	svg.append('path')
		.datum(topojson.feature(boundaries, boundaries.objects.collection))
		.attr('d', path)
		.attr('class', 'nyc');
	
	svg.selectAll("path")
		.data(topojson.feature(streets, streets.objects.collection).features)
		.enter().append("path")
		.attr("d", path)
		.attr("class", "street")
		.attr("id",function (el){
			return "street_id_"+el.properties._id;
		}) ;
	svg.selectAll("path.street")
		.append("svg:title")
		.attr("class","tooltip")
		.style("fill","black")
		.text(function(el) { return el.properties.n; });
	
	svg.selectAll("path.street")
		.on('mouseover', function(d){
		    d3.select(this).style({"stroke-width":'4'});
		})
		.on('mouseout', function(d){
		    d3.select(this).style({"stroke-width":'0.25'});
		})
		
	$("#street_apply,#street_kpi_list,#street_scale_list").prop('disabled', false);
	$("#street_loader").slideUp();
	
}


function mapStreetCallback(data){
	console.log(data)
	$("#street_apply,#street_kpi_list,#street_scale_list").prop('disabled', false);
	$("#street_loader").slideUp();
}
