
(function($){
	var $window = $(window);
	var $body = $('body');
	$('#show-menu').on('click touchstart', function(e){
		e.preventDefault();
		$body.toggleClass('menu-panel-visible');
		return false;
	});
	$('#main').on('click', function(e){
		$body.removeClass('menu-panel-visible');
	});
	$window.resize(function(){
		$body.removeClass('menu-panel-visible');
	});
})(jQuery);