(function ($) {
    'use strict';
    $(document).ready(function() {
        // Fix Header
        var num = 36; //number of pixels before modifying styles
        $(window).bind('scroll', function() {
            if ($(window).scrollTop() > num) {
                $('.fixed-wrapper').addClass('sticky');
            } else {
                $('.fixed-wrapper').removeClass('sticky');
            }
        });

        // Mobile Nav
        $('.sub-menu').append('<i class="fa fa-caret-right"></i>');
        $('.toggle-nav-bar').click(function() {
            $('#nav').slideToggle();
            $('#nav li').removeClass('open');
            $("#nav li").click(function() {
                $("#nav li").removeClass('open');
                $(this).addClass('open');
            });
        });

        //Skip Content
        $('a[href^="#main-content"]').click(function() {
            $('html,body').animate({
                scrollTop: $(this.hash).offset().top
            }, 500);
            e.preventDefault();
			return false;
        });
    });
}(jQuery));

//Drop down menu for Keyboard accessing
function dropdown1(dropdownId, hoverClass, mouseOffDelay) {
    if (dropdown = document.getElementById(dropdownId)) {
        var listItems = dropdown.getElementsByTagName('li');
        for (var i = 0; i < listItems.length; i++) {
            listItems[i].onmouseover = function () {
                this.className = addClass(this);
            }
            listItems[i].onmouseout = function () {
                var that = this;
                setTimeout(function () {
                    that.className = removeClass(that);
                }, mouseOffDelay);
                this.className = that.className;
            }
            var anchor = listItems[i].getElementsByTagName('a');
            anchor = anchor[0];
            anchor.onfocus = function () {
                tabOn(this.parentNode);
            }
            anchor.onblur = function () {
                tabOff(this.parentNode);
            }
        }
    }
    function tabOn(li) {
        if (li.nodeName == 'LI') {
            li.className = addClass(li);
            tabOn(li.parentNode.parentNode);
        }
    }
    function tabOff(li) {
        if (li.nodeName == 'LI') {
            li.className = removeClass(li);
            tabOff(li.parentNode.parentNode);
        }
    }
    function addClass(li) {
        return li.className + ' ' + hoverClass;
    }
    function removeClass(li) {
        return li.className.replace(hoverClass, "");
    }
}

jQuery(document).ready(function () {
    dropdown1('cmf-setting', 'hover', 10);
});

// Table Responsive
jQuery(function () {
    jQuery('table').wrap('<div class="scroll-table"></div>');
    jQuery(".scroll-table").before("<div class='guide-text'>Swipe to view <i class='fa fa-long-arrow-right'></i></div>");
});
(function ($) {
    'use strict';
//Search box toggle
    jQuery(document).ready(function() {
        //Begin show search on click....
        jQuery('#toggle_search').click(function() {
            jQuery('#toggleAccessibility').removeClass('active').addClass('not-active');
            jQuery(".accessiblity-container").slideUp(500, 'swing', function(){});
            var cssss = jQuery(this).attr('class');
            if (cssss === 'not-active' || cssss === undefined) {
                jQuery(".search_box").slideDown(500, 'swing', function (){});
                jQuery(".search-text").focus();
                jQuery(this).removeClass('not-active').addClass('active');
            } else {
                jQuery(".search_box").slideUp(500, 'swing', function (){});
                jQuery(".search-text").focus();
                jQuery(this).removeClass('active').addClass('not-active');
            }
        });
        //End search box on click

        //Begin show search box on tab press......
        jQuery(document).keyup(function() {
            if (jQuery('#toggle_search').is(':focus') || jQuery('.search-text').is(':focus') || jQuery('.search_submit').is(':focus')) {
                var cssss = jQuery('#toggle_search').attr('class');
                if (cssss === 'not-active' || cssss === undefined) {
                    jQuery(".search_box").slideDown(500, 'swing', function() {});
                    jQuery(".search-text").focus();
                    jQuery('#toggle_search').removeClass('not-active').addClass('active');
                }
            } else {
                jQuery(".search_box").slideUp(500, 'swing', function() {});
                jQuery('#toggle_search').removeClass('active').addClass('not-active');
            }
        }).click(function () {
            jQuery(".search_box").slideUp(500, 'swing', function() {});
            jQuery('#toggle_search').removeClass('active').addClass('not-active');
        });
        //End show search box on tab press......
        jQuery('.cmf-search').click(function (e) {
            e.stopPropagation();
        })
    });
}(jQuery));
//Accesibility Setting
(function ($) {
    'use strict';
    jQuery(document).ready(function() {
        //Begin show search on click....
        jQuery('#toggleAccessibility').click(function() {
            jQuery(".search_box").slideUp(500, 'swing', function () {});
            jQuery('#toggle_search').removeClass('active').addClass('not-active');
            var cssss = jQuery(this).attr('class');
            if (cssss === 'not-active' || cssss === undefined) {
                jQuery(this).removeClass('not-active').addClass('active');
                jQuery(".accessiblity-container").slideDown(500, 'swing', function() {});
            } else {
                jQuery(this).removeClass('active').addClass('not-active');
                jQuery(".accessiblity-container").slideUp(500, 'swing', function() {});
            }
        });

        jQuery(document).keyup(function () {
            if (jQuery('.cmf-accessibility a').is(':focus')) {
                jQuery(".accessiblity-container").slideDown(500, 'swing', function () {});
                jQuery('#toggleAccessibility').removeClass('not-active').addClass('active');
            } else {
                jQuery(".accessiblity-container").slideUp(500, 'swing', function () {});
                jQuery('#toggleAccessibility').removeClass('active').addClass('not-active');
            }
        }).click(function () {
            jQuery(".accessiblity-container").slideUp(500, 'swing', function () {});
            jQuery('#toggleAccessibility').removeClass('active').addClass('not-active');
        });

        jQuery('.cmf-accessibility').click(function (e) {
            e.stopPropagation();
        })
        //End search box on click
    });
}(jQuery));
// ===== Scroll to Top ==== 
// hide #back-top first
jQuery("#back-top").hide();

// fade in #back-top
jQuery(function ($) {
    jQuery(window).scroll(function () {
        if (jQuery(this).scrollTop() > 100) {
            jQuery('#back-top').fadeIn();
        } else {
            jQuery('#back-top').fadeOut();
        }
    });

    // scroll body to 0px on click
    jQuery('#back-top a').click(function () {
        jQuery('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
}(jQuery));
// Home Slider
jQuery('#homeslider').flexslider({
    animation: "slide",
    touch: true,
    controlNav: true,
    pausePlay: true,
});
// Footer Carousel						
jQuery('#flexCarousel').flexslider({
    animation: "slide",
    animationLoop: false,
    pausePlay: true,
    itemWidth: 200,
    itemMargin: 5,
    minItems: 2,
    maxItems: 6,
    slideshow: 1,
    move: 1,
    controlNav: true,
    playText: "",
    pauseText: "",
});

// The slider being synced must be initialized first

jQuery('#slider').flexslider({
    animation: "fade",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    sync: "#carousel"
});
jQuery('#carousel').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    itemWidth: 210,
    itemMargin: 15,
    asNavFor: '#slider'
});

jQuery('#home-slider').flexslider({
    animation: "slide",
    touch: true,
    controlNav: true,
    pausePlay: true,
});

jQuery('#important-link').flexslider({
    animation: "slide",
    touch: true,
    controlNav: true,
    pausePlay: true,
});

jQuery('#sliderall').flexslider({
    animation: "slide",
    touch: true,
    controlNav: true,
    pausePlay: true,
});

//search filter starts
jQuery(document).ready(function ($) {
    jQuery('#filter-btn').click(function (e) {
        e.stopPropagation();
        jQuery(".filter-box").toggle();
    });
    jQuery('#cmf-site-filter').click(function (e) {
        e.stopPropagation();
    });
    jQuery(document).keyup(function () {
        if (jQuery('#filter-btn').is(':focus') || jQuery('#categoryfilter').is(':focus') || jQuery('.filter-box button').is(':focus')) {
            jQuery('.filter-box').show();
        } else {
            jQuery('.filter-box').hide();
        }
    })
});
jQuery(document).click(function () {
    jQuery('.filter-box').hide();
});
jQuery(document).on('keydown', function (e) {
    if (e.keyCode === 27) { // ESC
        jQuery('.filter-box').hide();
    }
});

//search filter ends
//Whos who more details starts
jQuery(document).ready(function ($) {
    jQuery('.more a').click(function (e) {
        e.stopPropagation();
        jQuery(this).next(".other-details").toggle();
    });
    jQuery('.more').click(function (e) {
        e.stopPropagation();
    });
});
jQuery(document).click(function ($) {
    jQuery('.other-details').hide();
});
jQuery(document).on('keydown', function (e) {
    if (e.keyCode === 27) { // ESC
        jQuery('.other-details').hide();
    }
});

// Minister profile sticky starts
jQuery(window).on("load", function () {
    jQuery(function () { // document ready
        if (jQuery(window).width() > 1025) { // min screen size 1025
            if (!!jQuery('#sticky').length) { // make sure "#sticky" element exists
                var el = jQuery('#sticky');
                var stickyTop = jQuery('#sticky').offset().top; // returns number
                var footerTop = jQuery('#cmf-site-other-sections').offset().top; // returns number
                var stickyHeight = jQuery('#sticky').height();
                var limit = footerTop - stickyHeight - 20;
                jQuery(window).scroll(function () { // scroll event
                    var windowTop = jQuery(window).scrollTop(); // returns number
                    if (stickyTop < windowTop) {
                        el.css({position: 'fixed', width: '26%', top: 0});
                        var pWidth = jQuery('.miniter-details .left').width();
                        console.log(pWidth);
                        jQuery('#sticky').width(pWidth);
                    } else {
                        el.css({position: 'static', width: 'auto', top: 0});
                    }
                    if (limit < windowTop) {
                        var diff = limit - windowTop;
                        el.css({top: diff});
                    }
                });
            }
        }
    });
    var $mq = jQuery('.marquee').marquee({
        //speed in milliseconds of the marquee
        duration: 10000,
        //gap in pixels between the tickers
        gap: 50,
        //time in milliseconds before the marquee will start animating
        //delayBeforeStart: 0,
        //'left' or 'right'
        direction: 'up',
        //true or false - should the marquee be duplicated to show an effect of continues flow
        duplicated: true,
        pauseOnHover: true,
        startVisible: true,
    });
    //Pause
    jQuery('.pause').click(function () {
        $mq.marquee('pause');
        return false;
    });
    //Resume
    jQuery('.resume').click(function () {
        $mq.marquee('resume');
        return false;
    });
});
// Minister profile sticky ends
/* Equal height div in rows */
(function ($) {
    $(document).ready(function () {
        if ($(document).innerWidth() > 940) {
            var hroleftHeight = $(".homerow-one #cmf-site-left-content").outerHeight(true) - 30;
            var hrorightHeight = $(".homerow-one #cmf-site-right-content").outerHeight(true);
            var homelinkHeight = $(".cmf-site-homelink").outerHeight(true);
            if (hroleftHeight > hrorightHeight) {
                $(".homerow-one #cmf-site-right-content").css({"min-height": hroleftHeight + "px"});
            } else {
                var hrorightHeight1 = (hroleftHeight - homelinkHeight);
                $(".cmf-site-tab").css({"min-height": hrorightHeight1 + "px"});
            }
			var hrtleftHeight = $(".homerow-two #cmf-site-left-content").outerHeight(true);
            var hrtrightHeight = $(".homerow-two #cmf-site-right-content").outerHeight(true);
            if (hrtleftHeight > hrtrightHeight) {
                $(".homerow-two #cmf-site-right-content").css({"min-height": hrtleftHeight + "px"});
            } else {
                $(".homerow-two #cmf-site-left-content").css({"min-height": hrtrightHeight + "px"});
            }
        }
		
		$(".calendar-calendar table tbody tr .r").each(function() {  				
			$(this).parent().parent().parent().parent().parent().parent().addClass('green');
			var Id = $(this).parent().parent().parent().parent().parent().parent().attr('id');
			var newval = Id.slice(0, -2);
			var upper_cls = newval+"-date-box";
			$("#"+upper_cls).addClass('green');
			});
		$(".calendar-calendar table tbody tr .g").each(function() {
			$(this).parent().parent().parent().parent().parent().parent().addClass('red');
			var Idg = $(this).parent().parent().parent().parent().parent().parent().attr('id');
			var newvalg = Idg.slice(0, -2);
			var upper_clsg = newvalg+"-date-box";
			$("#"+upper_clsg).addClass('red');
		});
    });
}(jQuery));