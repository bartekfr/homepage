/*
* author: Bartlomiej Fryzowicz
*/
(function($) {
	var showTime;
	var hideTime;
	function tabsSolution() {
		var settings = this.options;
		var that = this.element;

		var navItems = this.getNavigation();
		var tabs = $(settings.tabContentItemSelector, that).addClass("tab-content-item");
		var activeIndex = settings.activeIndex;
		var activeClass = settings.activeClass;
		var activeTab;
		var effect = settings.type;
		var itemsNumber = tabs.length;
		var previousTab;
		var transEndEventName;
		var transCssName;
		var animatedProperties = {
			'fade': 'opacity',
			'slide': 'height'
		};
		var animatedProperty = animatedProperties[effect];
		var transitioned = false;
		showTime = settings.showTime;
		hideTime = settings.hideTime;

		var init = {
			'slide': $.noop,
			'fade': function(){
				tabs.not(activeTab).css({
					opacity: 0
				});
			},
			'ajax': $.noop
		};

		function transitionCommonInit(){
			var transitionPrefixed = Modernizr.prefixed('transition');
			var transitionPrefiedNames = {
				'WebkitTransition' : ['webkitTransitionEnd', '-webkit-transition'],
				'MozTransition'    : ['transitionend', '-moz-transition'],
				'OTransition'      : ['otransitionend', '-o-transition'],
				'msTransition'     : ['MSTransitionEnd', '-ms-transition'],
				'transition'       : ['transitionend', 'transition']
			};
			transEndEventName = transitionPrefiedNames[transitionPrefixed][0];
			transCssName = transitionPrefiedNames[transitionPrefixed][1];
			tabs.each(function(){
				var height = $(this).height();
				$(this).attr('data-init-height', height).height(height);
			}).not(activeTab).css({height: 0});
		}

		if(effect !== 'ajax') {
			setActive();
		}
		if(Modernizr.csstransitions) {
			transitionCommonInit();
			init[effect]();
		} else {
			tabs.not(activeTab).hide();
		}


		function setActive(){
			navItems.removeClass(activeClass).eq(activeIndex).addClass(activeClass);
			activeTab = tabs.removeClass(activeClass).eq(activeIndex).addClass(activeClass);
		}

		navItems.on('click', function(){
			if($(this).hasClass('active') || transitioned){
				return false;
			}
			previousTab = activeTab;
			activeIndex = navItems.index(this);
			setActive();
			effects[effect]();
			return false;
		});

		var effects = {
			fade: fadeAnim,
			slide: slideAnim,
			ajax: ajaxLoad
		};

		function fadeAnim(){
			if(Modernizr.csstransitions) {
				setCssTransition(hideTime);
				previousTab.css({
					opacity: 0
				});
				transitioned = true;
				previousTab.on(transEndEventName, function(){
					setCssTransition(showTime);
					previousTab.css('height', 0);
					activeTab.css('height', activeTab.attr('data-init-height'));
					activeTab.css({
						opacity: 1
					});
					$(this).off(transEndEventName);
					transitioned = false;
				});
			} else {
				transitioned = true;
				previousTab.stop(true, true).fadeOut(hideTime, function(){
					transitioned = false;
					activeTab.stop(true, true).fadeIn(showTime);
				});
			}
		}

		function slideAnim(){
			if(Modernizr.csstransitions) {
				setCssTransition(hideTime);
				previousTab.css({height: 0});
				transitioned = true;
				previousTab.on(transEndEventName, function(){
					setCssTransition(showTime);
					activeTab.css({
						height: activeTab.attr('data-init-height')
					});
					$(this).off(transEndEventName);
					transitioned = false;
				});
			} else {
				transitioned = true;
				previousTab.stop(true, true).slideUp(hideTime, function(){
					transitioned = false;
					activeTab.stop(true, true).slideDown(showTime);
				});
			}
		}

		function ajaxLoad() {
			var activeNav = navItems.eq(activeIndex);
			var contentHolder = $(settings.contentSelector, that);
			var href = $('a', activeNav).attr('href');
			if (typeof settings.ajaxContainer !== "undefined") {
				href += " " + settings.ajaxContainer;
			}
			var iconDiv = $('<div class="ajax-loading">');
			contentHolder.html(iconDiv).load(href);
		}

		function setCssTransition(time){
			tabs.css(transCssName, animatedProperty + ' ' + time + 'ms');
		}
	}

	$.widget('my.tabs', {
		options: {
			tabContentItemSelector: '.tab-content > li',
			contentSelector: ".tab-content",
			tabNavItemSelector: '.tab-nav >li',
			navSelector: ".tab-nav",
			activeClass: 'active',
			activeIndex: 0,
			showTime: 700,
			hideTime: 700,
			type: 'slide'
		},
		getNavigation: function() {
			this.navItems = $(this.options.tabNavItemSelector, this.element);
			return this.navItems;
		},
		setActive: function(i) {
			this.navItems.eq(i).click();
		},
		_setOption: function(key, value) {
			this._super(key, value);
			if(key === "showTime") {
				showTime = value;
			}
			if(key === "hideTime") {
				hideTime = value;
			}
		},
		_create: tabsSolution
	});
})(jQuery);

var tab = $('.tab').tabs();



