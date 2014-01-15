/**
 * @author Bartek Fryzowicz
 * TODO: make rotator responsive
 */
var paginator;

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
			gallerySelector: 'ul',
			type: 'carousel',
			speed: 600,
			duration: 4000,
			visibleItems: 1,
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
		var navigationSelector = settings.navigationSelector;
		var prevItem;

		function checkCallback(func) {
			if(typeof func === 'function') {
				func();
			}
		}

		/*initializing functions specific for each type of gallery*/
		var prepare = {
			stack: slicesPrepare
		};

		var images;
		var currentImgHolder;
		var imagesSrc = [];
		var slicesArray = [];
		var steps;
		var currentHeight;
		var sliceWidth;
		var isAnimated = false;
		var slices = [];

		function updateDimensions() {
			images = gallery.find('.originalImage');
			currentHeight = images.height();
			itemWidth = images.width();
			steps = 15;
			gallery.height(currentHeight);
			sliceWidth = Math.floor(itemWidth / steps);
			isAnimated = false;
			if(settings.effect === 'fade' || settings.effect === 'sharp') {
				steps = 1;
				sliceWidth = itemWidth;
			}
		}
		function slicesPrepare() {
			gallery.find('img').addClass('originalImage').css('visibility', 'hidden');
			updateDimensions();
			stackPrepare();
			images.each(function(i) {
				imagesSrc[i] = $(this).attr('src');
			});
			items.each(function(i) {
				for(var j = 0; j < steps; j++) {
					$('<div >', {
						"class": settings.effect + " rotator-slice o-" + (j + 1),
						css: {
							backgroundImage: 'url(' + imagesSrc[i] + ')',
						}
					}).appendTo($(this));
				}
			});
			items.each(function(i) {
				slicesArray[i] = $(this).find('.rotator-slice');
			});
			currentImgHolder = items.eq(activeItem);
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
							backgroundPosition:  - (steps- j - 1) * currentWidth + 'px 0',
							backgroundSize: itemWidth,
							height: currentHeight,
							width: currentWidth,
							left: currentLeft
						});
					}).finish();
				});
			}
			resize();

			$(window).on('resize', function() {
				resize();
			});
		}

		function stackPrepare() {
			items.each(function(index){
				$(this).css({
					zIndex: itemsNumber - index
				});
			});
		}

		/*animate functions specific for each type of gallery*/
		var animationFunction = {
			stack: stackAnimate
		};

		function stackAnimate(dir){
			if(isAnimated){
				return false;
			}
			var active = activeItem;
			var time = speed /steps;
			checkCallback(callback);
			if(dir === 'next') {
				activeItem++;
				if(activeItem === itemsNumber) {
					activeItem = 0;
				}
				isAnimated = true;
				slices = slicesArray[active];
				if(settings.effect === 'dissolve' || settings.effect === 'fade') {
					slices.each(function(s) {
						$(this).animate({
								opacity: 0
							},
							time * (s + 1),
							function() {
								if ((s === (steps - 1))) {
									isAnimated = false;
									jumpToStackImage();
									updateCurrentHolder(active);
									checkCallback(callbackAfter);
								}
							}
						);
					});
				} else if (settings.effect === 'sharp') {
					slices.each(function(s) {
						$(this).animate({
								width: 0
							},
							time * (s + 1),
							function() {
								if ((s === (steps - 1))) {
									isAnimated = false;
									jumpToStackImage();
									updateCurrentHolder(active);
									checkCallback(callbackAfter);
								}
							}
						);
					});
				}
			} else if(dir === 'prev') {
				activeItem--;
				if(activeItem < 0) {
					activeItem = itemsNumber - 1;
				}
				jumpToStackImage(activeItem);
				updateCurrentHolder(active);
			}	else {
				jumpToStackImage(activeItem);
				updateCurrentHolder(active);

			}
			setActive();
		}

		function updateCurrentHolder(k) {
			slicesArray[k].css('opacity', 1).width(sliceWidth);
			currentImgHolder = items.eq(activeItem);
		}

		function jumpToStackImage() {
			var k = activeItem;
			items.each(function(i) {
				if (i < k) {
					$(this).css('z-index',  k - i - 1);
				} else if (i > k ) {
					$(this).css('z-index',  itemsNumber - (i - k));
				} else if (i === k){
					$(this).css('z-index', itemsNumber);
				}

			});
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
		function setStyles(){
			gallery.wrap('<div class="gallery-wrapper">');
		}

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
					prevItem = activeItem;
					activeItem = $(navigation.items, navigation.container).index(this);
					animationFunction[type]();
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
				var index = activeItem % itemsNumber;
				if(index < 0) {
					index = itemsNumber + index;
				}
				navigation.container.find(navigation.items).removeClass('active').eq(index).addClass('active');
			}
		}

		prepare[type]();
		setStyles();
		getNavigation();
		setActive();
		bindEvents();
		if (autostart) {
			setAutorotate();
		}

	};

})(jQuery);

$(window).on('load', function(){
	galleryRotator({panelSelector: '.gallery-section-rotator', type: 'stack', effect: "dissolve", speed: 1000});
	galleryRotator({panelSelector: '.gallery-section-fade', type: 'stack', effect: "sharp", speed: 1700, autostart: false});
});
