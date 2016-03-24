// parse json and build location and party view
var gNews_getRidingDetailsCallback = function( json ) {
	var curentView=1;
	for( var i in json ) 
	{
		// count total results fot thi s office
		var totalResults=0;		
		// count party position
		var count;
		// sort results to get vinners at the top
		var sortedResults = json[i].results.sort( function( a, b ) {
		   return a.votes < b.votes ? 1 : -1;
		})
		//add office to carusel
		$('#carousel_ul').append('<li class="office_'+json[i].id+' office"></li>');
		$('.office_'+json[i].id).append('<h2>'+json[i].name+'</h2>');
		$('.office_'+json[i].id).append('Polls reported:'+json[i].pollsReported+'<br/>');
		$('.office_'+json[i].id).append('Polls total:'+json[i].pollsTotal+'<br/>');

		for( var j in sortedResults ) {
			totalResults=totalResults+sortedResults[j].votes;
		}
		// display results
		for( var j in sortedResults ) {
			var selected = "",
				party = "",
				totals = "";
				count = Number(j)+1;
			if(j==0)
			{
				if(sortedResults[j].isElected)
				{
					selected='<span class="vinner">&#9734;</span>';
				}
			}
			//output party resultats 
			party='<div class="partyName">' + sortedResults[j].partyCode + '</div>';
			totals='<div class="totals">Vote totals: ' + sortedResults[j].votes + ' - ' + (sortedResults[j].votes/(totalResults/100)).toFixed(1)+'%</div>';
			
			$('.office_'+json[i].id).append('<div class="party party_'+sortedResults[j].partyCode + '"><h3>'+count + '. ' + sortedResults[j].name + selected + '</h3>' + party + totals + '</div>');
		}
	}
	//move he last list item before the first item, on slide left to be able to see the last item
	$('#carousel_ul li:first').before($('#carousel_ul li:last'));
}; 
 
$(document).ready(function() { 
	//get the left indent to the default -328px
	var left_position = '-328px';
	var original_width=1045;
	//json url
	var url = 'http://static.globalnews.ca/content/test/results-2011.js';
	$.ajax({
	   type: 'GET',
	    url: url,
	    async: true,
	    jsonpCallback: 'gNews_getRidingDetailsCallback',
	    contentType: "application/json",
	    dataType: 'jsonp',
	    error: function(e) {
	       alert(e.message);
	    }
	});
	//slider
	//sliding right        
	$('#right_scroll').click(function(){
		//get the width of the items ( i like making the jquery part dynamic, so if you change the width in the css you won't have o change it here too ) '
		var item_width = $('#carousel_ul li').outerWidth() + 10;
		//calculae the new left indent of the unordered list
		var left_indent = parseInt($('#carousel_ul').css('left')) - item_width;
		//make the sliding effect using jquery's anumate function '
		$('#carousel_ul:not(:animated)').animate({'left' : left_indent},500,function(){    
			//get the first list item and put it after the last list item (that's how the infinite effects is made) '
			$('#carousel_ul li:last').after($('#carousel_ul li:first'));          
			$('#carousel_ul').css({'left' : left_position });
		}); 
	});
	//sliding left
	$('#left_scroll').click(function(){
		var item_width = $('#carousel_ul li').outerWidth() + 10;
		/* same as for sliding right except that it's current left indent + the item width (for the sliding right it's - item_width) */
		var left_indent = parseInt($('#carousel_ul').css('left')) + item_width;
		$('#carousel_ul:not(:animated)').animate({'left' : left_indent},500,function(){    
			/* when sliding to left we are moving the last item before the first list item */            
			$('#carousel_ul li:first').before($('#carousel_ul li:last')); 
			$('#carousel_ul').css({'left' : left_position });
		});
	});
	// window resize fix
	function windowResize(){
		var win_width=$( window ).width();
		// three coulumn view
		if(win_width>1048)
		{
			$('#carousel_container').css('width',original_width+'px');
			$('#carousel_inner').css('width',(original_width-40)+'px');
		}
		// two coulumn view
		if(win_width<1048)
		{
			$('#carousel_container').css('width',(original_width - 333)+'px');
			$('#carousel_inner').css('width',((original_width-40) - 333)+'px');
		}
		// one coulumn view
		if(win_width<720)
		{
			$('#carousel_container').css('width',((original_width - 359)-305)+'px');
			$('#carousel_inner').css('width',(((original_width-40) - 359)-305)+'px');
		}
	}
	$( window ).resize(function() {
		 windowResize();
	});
	windowResize();
});