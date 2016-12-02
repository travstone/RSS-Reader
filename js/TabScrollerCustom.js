// Cache selectors
var lastId,
topMenu = $("#top-menu"),
topMenuHeight = 50;//topMenu.outerHeight()-40,
// All list items
menuItems = topMenu.find("a"),
// Anchors corresponding to menu items
scrollItems = menuItems.map(function(){
	var item = $($(this).attr("href"));
	if (item.length) { return item; }
});

// Bind click handler to menu items
// so we can get a fancy scroll animation
menuItems.click(function(e){
	e.preventDefault();
	var href = $(this).attr("href"),
	offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;
	$('html, body').stop().animate({
		scrollTop: offsetTop
	}, 500);
});

// Bind to scroll
$(window).scroll(function(){
	// Get container scroll position
	var fromTop = $(this).scrollTop()+topMenuHeight;

	// Get id of current scroll item
	var cur = scrollItems.map(function(){
		if ($(this).offset().top < fromTop)
		return this;
	});
	// Get the id of the current element
	cur = cur[cur.length-1];
	var id = cur && cur.length ? cur[0].id : "";

	if (lastId !== id) {
		lastId = id;
		// Set/remove active class
		menuItems.removeClass("active");
		var $active = menuItems.filter("[href=#"+id+"]");
		$active.addClass("active");
		if($active.text().trim().length > 0){
			$('#nav-current').text($active.text().trim());
		} else {
			$('#nav-current').text('');
		}
	}
});