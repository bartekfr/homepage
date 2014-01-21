/**
 * @author Bartek Fryzowicz
 * TODO: refactoring, maybe switch to CSS3 Animations?, move paginator to separate file

*/


var paginator;
/*
 Pagination component
*/
(function ($) {
	var DEFAULT = {
		arrows: true,
		numeric: true,
		navClass: 'menu',
		itemClass: 'nav-item',
		prevText: '&laquo;',
		nextText: '&raquo;',
		icons: false,
		numericClass: 'item-number'
	};

	paginator = function(options) {
		var settings = $.extend({}, DEFAULT, options);
		var arrows = settings.arrows;
		var numeric = settings.numeric;
		var itemsNumber = settings.itemsNumber;
		var parent = settings.parent;
		var nextText = settings.nextText;
		var prevText = settings.prevText;
		var numericSelector = '.' + settings.numericClass;
		var prev;
		var next;
		var prevA;
		var nextA;
		var items = [];
		var icons;

		var navigationList = $('<ul>', {
				"class": settings.navClass + ' js-generated'
			});

		function generateNumericItems() {
			if(settings.icons) {
				createIconsArray();
			}
			for(var i = 0, max = itemsNumber; i < max; i++) {
				var content = i + 1;
				if (settings.icons) {
					content = '<img src="' + icons[i] + '" />';
				}
				var item = $('<li/>', {
					'class': settings.numericClass + ' ' + settings.itemClass
				}).append('<a href="#">' + content + '</a>');
				navigationList.append(item);
			}
			items = $(numericSelector, navigationList);
		}

		function createIconsArray(){
			icons = [];
			parent.find(settings.itemSelector).each(function(){
				var src = $(this).data('thumb');
				icons.push(src);
			});
		}

		function generateArrows(){
			prevA = $('<a href="#" />').html(prevText);
			prev = $('<li/>', {
				'class': settings.itemClass + ' prev'
			}).append(prevA);
			nextA = $('<a href="#" />').html(nextText);
			next = $('<li/>', {
				'class': settings.itemClass + ' next'
			}).append(nextA);

			navigationList.prepend(prev);
			navigationList.append(next);
		}

		if(numeric){
			generateNumericItems();
		}

		if(arrows) {
			generateArrows();
		}

		parent.append(navigationList);

		return {
			container: navigationList,
			prevButton: prevA,
			nextButton: nextA,
			items: items
		};
	};
}(jQuery));



var galleryRotator;
(function($){
	galleryRotator = function(options, callback, callbackAfter) {
		var DEFAULT = {
			panelSelector: '.panel.carousel',
			gallerySelector: '.rotator',
			type: 'carousel',
			speed: 600,
			duration: 4000,
			effect: 'fade',
			autostart: true,
			navigation: {
				arrows: true,
				numeric: true,
				numericClass: 'item-number'
			},
			itemSelector: 'li'
		};
		var settings = $.extend(true, {}, DEFAULT, options);
		var gallerySection = $(settings.panelSelector);
		if(!gallerySection.length) {
			return false;
		}
		var gallery = $(settings.gallerySelector, gallerySection);
		var type = settings.type;
		var itemSelector = settings.itemSelector;
		var items = $(itemSelector, gallery).addClass('item');
		var itemWidth = items.width();
		var itemsNumber = items.length;
		var speed = settings.speed;
		var duration = settings.duration;
		var navOptions = settings.navigation;
		var activeItem = 0;
		var navigation = {};
		var autostart = settings.autostart;
		var interval;
		var effect = settings.effect;
		var navigationSelector = settings.navigationSelector;

		function checkCallback(func) {
			if(typeof func === 'function') {
				func();
			}
		}

		/*
		initializing functions specific for each type of gallery
		currently only one gallery type exists
		*/
		var prepare = {
			stack: slicesPrepare
		};

		var images;
		var currentImgHolder = items.eq(activeItem);
		var imagesSrc = [];
		var slicesArray = [];
		var steps  =  15;
		var currentHeight;
		var sliceWidth;
		var isAnimated = false;
		var slices = [];

		function updateDimensions() {
			images = gallery.find('.originalImage');
			currentHeight = images.height();
			itemWidth = images.width();
			gallery.height(currentHeight);
			sliceWidth = Math.floor(itemWidth / steps);
			if(effect === 'fade' || effect === 'sharp') {
				steps = 1;
				sliceWidth = itemWidth;
			}
		}

		function slicesPrepare() {
			gallery.find('img').addClass('originalImage').css('visibility', 'hidden');
			updateDimensions();
			images.each(function(i) {
				imagesSrc[i] = $(this).attr('src');
			});
			items.css('z-index', 0).first().css('z-index', 2);
			items.each(function(i) {
				for(var j = 0; j < steps; j++) {
					$('<div >', {
						"class": effect + " rotator-slice o-" + (j + 1),
						css: {
							backgroundImage: 'url(' + imagesSrc[i] + ')',
						}
					}).appendTo($(this));
				}
			});
			items.each(function(i) {
				slicesArray[i] = $(this).find('.rotator-slice');
			});
			resize();
		}

		function resize() {
			updateDimensions();
			items.each(function(i) {
				var currentSlices = $('.rotator-slice', this);
				var prevLeft = 0;

				currentSlices.css('background-size', itemWidth).each(function(j) {
					var currentWidth = sliceWidth;
					var currentLeft = itemWidth - (j + 1) * currentWidth;
					if((j === steps - 1) && steps !== 1) {
						currentLeft = 0;
						currentWidth = prevLeft;
					}
					prevLeft = currentLeft;

					$(this).css({
						backgroundPosition:  - currentLeft + 'px 0',
						backgroundSize: itemWidth,
						height: currentHeight,
						width: currentWidth,
						left: currentLeft
					}).finish();
				});
			});
		}

		$(window).on('resize', function() {
			resize();
		});

		/*animate functions specific for each type of gallery*/
		var animationFunction = {
			stack: stackAnimate
		};

		function prepareToCurrentAnimation(current, next) {
			items.css('visibility', 'hidden').css('z-index', 0);
			var $current =  items.eq(current).css('visibility', 'visible').css('z-index', 2);
			var $next = items.eq(next).css('visibility', 'visible').css('z-index', 1);
		}
		function endAnimation(prev, current) {
			var $prev =  items.eq(prev).css('visibility', 'hidden').css('z-index', 0);
			var $current = items.eq(current).css('visibility', 'visible').css('z-index', 2);
			resetCurrentHolder(prev);
			checkCallback(callbackAfter);
		}

		function stackAnimate(dir, no){
			if(isAnimated){
				return false;
			}
			var prev = activeItem;
			var time = speed /steps;
			checkCallback(callback);

			//calculate next active item
			if(dir === 'next') {
				activeItem++;
				if(activeItem === itemsNumber) {
					activeItem = 0;
				}
			} else if(dir === 'prev') {
				activeItem--;
				if(activeItem < 0) {
					activeItem = itemsNumber - 1;
				}
			} else  if (dir === 'nodir') {
				activeItem = no;
			}

			//animations functions
			prepareToCurrentAnimation(prev, activeItem);
			isAnimated = true;
			slices = slicesArray[prev];
			var animationProperty = {
				dissolve: {
					opacity: 0
				},
				fade: {
					opacity: 0
				},
				sharp: {
					width: 0
				},
				blind: {
					height: 0
				}
			};
			setActive();
			slices.each(function(s) {
				$(this).animate(
					animationProperty[effect],
					time * (s + 1),
					function() {
						if ((s === (steps - 1))) {
							isAnimated = false;
							endAnimation(prev, activeItem);
						}
					}
				);
			});
		}

		//reset item to default state
		function resetCurrentHolder(k) {
			if(effect === 'dissolve' || effect === 'fade') {
				slicesArray[k].css({
					opacity: 1
				});
			}
			if(effect === 'blind') {
				slicesArray[k].css({
					height: currentHeight
				});
			}
			if(effect === 'sharp') {
				slicesArray[k].css({
					width: sliceWidth
				});
			}
			currentImgHolder = items.eq(activeItem);
		}

		/*interval functions specific for each type of gallery*/
		var timeoutAction = {
			stack: function(){
				animationFunction[type]('next');
			}
		};

		function setAutorotate(){
			interval = setInterval(function(){
				timeoutAction[type]();
			}, duration);
		}

		/* core functions */
		function getNavigation() {
			if(typeof navigationSelector !== 'undefined') {
				navigation.container = $(navigationSelector, gallerySection);
				navigation.prevButton = $('.prev a', navigation.container);
				navigation.nextButton = $('.next a', navigation.container);
				navigation.items = $('.' + navOptions.numericClass, navigation.container);
			} else if((navOptions.arrows || navOptions.numeric)) {
				navigation = printNav();
			}
		}

		function printNav(){
			var options = navOptions;
			options.parent = gallerySection;
			options.itemsNumber = itemsNumber;
			options.itemSelector = itemSelector;
			return paginator(navOptions);
		}

		function bindEvents(){
			if(navOptions.arrows) {
				navigation.nextButton.on('click', function(){
					updateInterval();
					animationFunction[type]('next');
					return false;
				});
				navigation.prevButton.on('click', function(){
					updateInterval();
					animationFunction[type]('prev');
					return false;
				});
			}
			if (navOptions.numeric){
				navigation.items.on('click', function(){
					updateInterval();
					var itemNumber = $(navigation.items, navigation.container).index(this);
					if(itemNumber === activeItem) {
						return false;
					}
					animationFunction[type]("nodir", itemNumber);
					return false;
				});
			}
		}

		function updateInterval() {
			clearInterval(interval);
			if(autostart) {
				setAutorotate();
			}
		}

		function setActive(){
			if(navOptions.numeric) {
				navigation.container.find(navigation.items).removeClass('active').eq(activeItem).addClass('active');
			}
		}

		//rotator kick-off
		prepare[type]();
		getNavigation();
		setActive();
		bindEvents();
		if (autostart) {
			setAutorotate();
		}

	};

})(jQuery);

$(window).on('load', function(){
	galleryRotator({panelSelector: '.gallery-section-rotator', type: 'stack', effect: "dissolve", speed: 1000, autostart: false});
	galleryRotator({panelSelector: '.gallery-section-blind', type: 'stack', effect: "blind", speed: 1700, autostart: true});
});
