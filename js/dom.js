//
var feedReader = function(feed,handler,name){

	function interimHandler(data){
		handler(data,name);
		$('.'+name+' .loading').remove();
	}

	function errorHandler(data){
		$('.'+name+' .loading').text('Error : ' + data.status + ' ' + data.statusText + ' ('+name+')');
		console.log(data);
	}

	function completeHandler(data){
		//$('#header').append('<p>Completed: ' + data.status + ' ' + data.statusText + ' ('+name+')</p>');
		//console.log(data);
	}

	$('.'+name).append('<span class="loading">Loading...</span>');
	$.ajaxSetup({ cache: false });
	$.ajax({
  		// type:     "GET",
  		// dataType: "xml",
		url : feed,
		success: interimHandler,
		error: errorHandler,
		complete: completeHandler
	});
};

function removeIframes(input) {
	var iframeRegex = /(&lt;iframe|<iframe).*(\/iframe&gt;|\/iframe>)/gi;
	var output = input.replace(iframeRegex,'');
	return output;
}
function replaceMediaTags(input){
	var mediaThumbRegex = /(<|&lt;)media\:thumbnail/gi;
	var output = input.replace(mediaThumbRegex,'<img');
	return output;
}
function removeStyles(input){
	var styleRegex = /(\ style=(?:'|")(?:[^"|']*)(?:'|"))/gi;
	var output = input.replace(styleRegex,'');
	return output;
}

function addHostname(string,host){
	//console.log(string,host);
	var hostname = host.slice(0,26);
	var hostnameRegex = /src=("|')\//gi;
	var output = string.replace(hostnameRegex,'src='+hostname+'/');
	return output;
}

function getLocalDate(string){
	var dateObj = new Date(string);
	var dateString = dateObj.toString();
	var dateStringStop = dateString.indexOf('GMT');
	var cleanDateString = dateString.slice(0,dateStringStop);
	return cleanDateString;
}



function handleData(data,name){
	var feedTitle = $(data).find('title').first().text();
	var feedLink = $(data).find('link').first().text();
	var feedData = {'feedTitle':feedTitle,'feedLink':feedLink};
	var $items = $(data).find('item');
	var itemsArray = [],
		item = {},
		count;
	var itemsToGet = $('#rendered').attr('data-num-items');
	//for(count = 0; count < $items.length; count++){
	for(count = 0; count < itemsToGet; count++){
		var $raw = $($items[count]);
		//item.title = decodeURI($raw.find('title').first().text());
		item.title = $raw.find('title').first().text();
		item.link = $raw.find('link').text();
		item.desc = removeIframes($raw.find('description').text());
		item.desc = removeStyles(item.desc);
		//item.desc = addHostname(item.desc,item.link);
		//item.images = replaceMediaTags($raw.find('description').text());
		if($raw.find('pubDate').text()){
			item.pubDate = getLocalDate($raw.find('pubDate').text());
		} else {
			item.pubDate = 'No date'
		}
		itemsArray.push(item);
		item = {};
	}

	renderHtml(itemsArray,feedData,name);

	function renderHtml(items,feedData,name){
		var itemRow = "",
		//$rowContainer = $('<div class="row"></div>'),
		$outerContainer = $('<div data-rss-feed-title="'+name+'"></div>');
		$container = $('<div class="container" data-rss-feed-title="'+name+'"></div>');
		$outerContainer.append('<header><h1>Feed: <a href="'+feedData.feedLink+'">'+feedData.feedTitle+'</a></h1></header>');
		var count2;
		for(count2 = 0; count2 < items.length; count2++){
		//for(count2 = 0; count2 < 3; count2++){

			var myItem = items[count2];
			var $itemHtml = $(
					'<div class="item col-xs-12 col-sm-12 col-md-12 col-lg-12">' +
					'<h2><a href="'+myItem.link+'">'+myItem.title+'</a></h2>' +
					'<h6 class="pub-date">'+myItem.pubDate+'</h6>' +
					'<a href="#" class="action-expand-item-toggle btn btn-default btn-xs hidden">Expand</a>' +
					'<div class="content">'+myItem.desc+'</div>' +
					'<a href="#" class="action-expand-item-toggle btn btn-default btn-xs hidden">Expand</a>' +
					'</div>'
				);
			// if(myItem.desc.length >= 1600){
			// 	// $itemHtml.find('.content').addClass('condensed');
			// 	// $itemHtml.find('.action-expand-item-toggle').removeClass('hidden');
			// 	// $itemHtml.find('.content').css('height','90px');
			// }
			// if(((count2 > 0) && (count2 % 1 === 0)) || (count2 === $items.length)){
			// 	$container.append($rowContainer);
			// 	$rowContainer = $('<div class="row"></div>');
			// 	if(count === $items.length){
			// 		$outerContainer.append($container);
			// 	}
			// }

			//$rowContainer.append($itemHtml);
			$outerContainer.append($itemHtml);
		}

		$('#rendered').children('[data-feed-group="'+name+'"]').slideUp().children().remove();
		$('#rendered').children('[data-feed-group="'+name+'"]').append($outerContainer.html()).slideDown(200);
		toggleItemHeight($container);
	}
}

function getFeeds(){
	$('#rendered .feedgroup').children().remove();

	
	var numItemsDisplay = $('#rendered').attr('data-num-items');
	$('#num-items-display').text(numItemsDisplay);


	var $groups = $('.feed-group');
	$groups.each(function(){
		var name = $(this).attr('data-feed-group');
		var url =  'feeds/' + name + '.xml';
		feedReader(url,handleData,name);
	});
}

function toggleItemHeight($target){
	var $container = $target.parent('.item');
	var $content = $target.parent().find('.content');
	if($content.hasClass('condensed')){
		$content.animate({
			height: '100%'
		},0,function(){
			$container.find('.action-expand-item-toggle').text('Collapse');
			$content.removeClass('condensed');
		});
	} else {
		$content.animate({
			height: '90px'
		},0,function(){
			$content.addClass('condensed');
			$container.find('.action-expand-item-toggle').text('Expand');
		});
	}
}

$('body').on('click','.action-expand-item-toggle',function(e){
	e.preventDefault();
	toggleItemHeight($(this));
});

$('body').on('click','#action-expand-all',function(e){
	e.preventDefault();
	var isExpanded = $(this).attr('data-view-all-expanded');
	if(isExpanded === 'false'){
		$(this).attr('data-view-all-expanded','true')
		.html('<span class="glyphicon glyphicon-folder-close"> </span>&nbsp;&nbsp;Collapse All</a>');
	} else {
		$(this).attr('data-view-all-expanded','false')
		.html('<span class="glyphicon glyphicon-folder-open"> </span>&nbsp;&nbsp;Expand All</a>');
	}
	$('.action-expand-item-toggle').click();
});

$('body').on('click', '#action-toggle-nav', function(e){
	e.preventDefault();
	e.stopPropagation();
	if($('#prefs-menu').is(':visible')){
		$('#prefs-menu').toggle();
	}
	$('#top-menu').toggle();
});


$('body').on('click', '#top-menu a', function(e){
	e.preventDefault();
	e.stopPropagation();
	$('#top-menu').toggle();
});

$('#action-update-prefs').on('click',function(e){
	e.preventDefault();
	e.stopPropagation();
	//$('#nav-current').hide();
	//$('#messages').text('Stand by... now updating feeds!');
	//$.ajax({
	//	url : 'getFeeds.php',
	//	success: feedsUpdated
	//});
	if($('#top-menu').is(':visible')){
		$('#top-menu').toggle();
	}
	$('#prefs-menu').toggle();
});

$('body').on('click', '#prefs-menu a', function(e){
	e.preventDefault();
	e.stopPropagation();
	$('#prefs-menu').toggle();
});

$('#action-update-feeds').on('click',function(e){
	e.preventDefault();
	$('#nav-current').hide();
	$('#messages').text('Updating feeds...');
	$('#messages').show();
	$.ajax({
		url : 'getFeeds.php',
		success: feedsUpdated
	});
});
$('#onClick-update-num-items').on('click',function(e){
	e.preventDefault();
	$('#num-items-form').addClass('num-items-displayed').removeClass('hidden');
	$('#num-items-form #number-of-items-input').val($('#rendered').attr('data-num-items'));
	//return false;
});

$('#action-update-num-items').on('click',function(e){
	e.preventDefault();
	e.stopPropagation();
	var numItems = $('#number-of-items-input').val();
	$('#rendered').attr('data-num-items',numItems);
	$('#num-items-form').addClass('hidden').removeClass('num-items-displayed');
	getFeeds();
	return false;
});

$('#action-cancel-num-item').on('click',function(e){
	e.preventDefault();
	e.stopPropagation();
	$('#num-items-form').addClass('hidden').removeClass('num-items-displayed');
});




$('body').on('click',function(e){ // touchend touchcancel
	//e.preventDefault();
	//e.stopPropagation();
	var $menus = $('#prefs-menu, #top-menu');
	$menus.each(function(){
		//console.log($(this));
		//console.log($(this).is(':visible'));
		if($(this).is(':visible')){
			$(this).toggle();
		}
	});
});

function feedsUpdated(){
	console.log('feeds updated');
	$('#messages').hide().text('Feeds updated!').show();
	setTimeout(function() {
		$('#messages').hide();
		$('#nav-current').show();
	}, 2000);
	getFeeds();
}

getFeeds();