(function ($) {
    'use strict';
    $(document).ready(function() {
          // store the slider in a local variable
    var $window = $(window),
    flexslider;
    
    // tiny helper function to add breakpoints
    function getGridSize() {
    return (window.innerWidth < 280) ? 1 :
    (window.innerWidth < 600) ? 2 :
    (window.innerWidth < 800) ? 2 :
    (window.innerWidth < 900) ? 2 : 5;
    }

      
    $window.ready(function() {
                $('figure img').ma5gallery({
                    preload:true
                });
                
                $('#socialTab').easyResponsiveTabs({
                        type: 'default', //Types: default, vertical, accordion
                        width: 'auto', //auto or any width like 600px
                        fit: true, // 100% fit in a container
                        tabidentify: 'socialTab_1', // The tab groups identifier
                        activate: function(event) { // Callback function if tab is switched
                            var $tab = $(this);
                            var $info = $('#nested-tabInfo');
                            var $name = $('span', $info);
                            $name.text($tab.text());
                            $info.show();
                        }
                    });
                
                $('#feedTab').easyResponsiveTabs({
                        type: 'default', //Types: default, vertical, accordion
                        width: 'auto', //auto or any width like 600px
                        fit: true, // 100% fit in a container
                        tabidentify: 'feedTab_1', // The tab groups identifier
                        activate: function(event) { // Callback function if tab is switched
                            var $tab = $(this);
                            var $info = $('#nested-tabInfo');
                            var $name = $('span', $info);
                            $name.text($tab.text());
                            $info.show();
                        }
                    });
                
                $('.resp-tabs-list li a').click(function(event){
                            event.preventDefault();								 
                        })
                        $(document).ready(function(){
                            $('figure img').ma5gallery({
                                preload:true
                            });
                        });
//Horizontal Tab
$('#parentHorizontalTab').easyResponsiveTabs({
    type: 'default', //Types: default, vertical, accordion
    width: 'auto', //auto or any width like 600px
    fit: true, // 100% fit in a container
    tabidentify: 'hor_1', // The tab groups identifier
    activate: function(event) { // Callback function if tab is switched
        var $tab = $(this);
        var $info = $('#nested-tabInfo');
        var $name = $('span', $info);
        $name.text($tab.text());
        $info.show();
    }
});

// Child Tab
$('#ChildVerticalTab_1').easyResponsiveTabs({
    type: 'vertical',
    width: 'auto',
    fit: true,
    tabidentify: 'ver_1', // The tab groups identifier
    activetab_bg: '#fff', // background color for active tabs in this group
    inactive_bg: '#fff', // background color for inactive tabs in this group
    active_border_color: '#c1c1c1', // border color for active tabs heads in this group
    active_content_border_color: '#5AB1D0' // border color for active tabs contect in this group so that it matches the tab head border
});

//Vertical Tab
$('#parentVerticalTab').easyResponsiveTabs({
	type: 'vertical', //Types: default, vertical, accordion
	width: 'auto', //auto or any width like 600px
	fit: true, // 100% fit in a container
	closed: 'accordion', // Start closed if in accordion view
	tabidentify: 'hor_1', // The tab groups identifier
	activate: function(event) { // Callback function if tab is switched
		var $tab = $(this);
		var $info = $('#nested-tabInfo2');
		var $name = $('span', $info);
		$name.text($tab.text());
		$info.show();
	}
});

	// For Policy Framework page tab code
		$('#tabs div.tab-content').hide();
		$('#tabs div.tab-content:first').show();
		$('#tabs ul li:first').addClass('newactive');
		$('#tabs ul li a').click(function(){
			$('#tabs ul li').removeClass('newactive');
			$(this).parent().addClass('newactive');
			var currentTab = $(this).attr('href');
			$('#tabs div.tab-content').hide();
			$(currentTab).show();
			return false;
		});
   });
   
    /*var a = 0;
    $(window).scroll(function() {
    
      var oTop = $('#counter').offset().top - window.innerHeight;
      if (a == 0 && $(window).scrollTop() > oTop) {
        $('.count').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 4000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
        a = 1;
      }
    
    });*/
if(typeof $(".view-id-last_updated .field-content").html() === 'undefined'){}else{
$(".footer-content").after('<div class="alterupdated">Last Updated : '+$(".view-id-last_updated .field-content").html()+'</div>');	
}

console.log($(".msdelastupdated").html());

if(typeof $(".msdelastupdated").html() == 'undefined'){}else{
$("#cmf-site-breadcrumb").after('<div class="alterupdatedInner">'+$(".msdelastupdated").html()+'</div>');
}

	
    });
}(jQuery));

// ====Tab scrolling text====
function changeClass(){    
    var x = document.getElementsByClassName("text-slide"); 
    var y = document.getElementsByClassName("scroll-text");                           
    x[0].classList.toggle ("pause");
    y[0].classList.toggle("scroll-left");                            
}
function changeClass1(){    
    var x = document.getElementsByClassName("text-slide1"); 
    var z = document.getElementsByClassName("scroll-text-1");                              
    x[0].classList.toggle ("pause");
    z[0].classList.toggle("scroll-left");                             
}

(function ($) {
$(document).ready(function() {
	$('#flexCarousel a').attr({ target: "_blank" });
	$('#flexCarousel a').attr({ title: "External site that opens in a new window" });
	$('.a-link, .external-link a').attr({ title: "External link that opens in a new window" });
	$('.views-table a').attr({ target: "_blank" });
	$('.update-pdf a').attr({ target: "_blank" });
	$('.link-pdf, .views-table a, .update-pdf a').attr({ title: "This pdf open in a new window"});
	$('.image-title a').attr({ title: "This image open in a new window"});
	$('.excel-title a').attr({ title: "This excel open in a new window"});
	$('.tables-link').attr({ title: "External link that opens in a new window" });
});
}(jQuery));
// ===== Scroll to Top ==== 
 (function ($) {
    'use strict';
    $(document).ready(function() {
        $(document).scroll(function() { 
            if ($(this).scrollTop() > 100) { 
                $('#scroll').fadeIn(); 
            } else { 
                $('#scroll').fadeOut(); 
            } 
        }); 
        $('#scroll').click(function(){
            $("html, body").animate({ scrollTop: 0 }, 800); 
            return false; 
        });
    });
}(jQuery));
//Sliders
jQuery('#flexCarouse2').flexslider({
    animation: "slide",
    animationLoop: true,
    itemWidth: 380,
    itemMargin: 25,
    minItems: 1,
    maxItems: 1,
    //slideshow: 1,
    move: 1,
    pausePlay: true,
    controlNav: false,
    start: function(slider){
        jQuery('body').removeClass('loading');
      if (slider.pagingCount === 1) slider.addClass('flex-centered');
    }
  });
jQuery('#flexSlider').flexslider({
    animation: "slide",
    pausePlay: true,
    controlNav: true,
    start: function(slider){
    jQuery('body').removeClass('loading');
    }
});
jQuery('#flexSlider1').flexslider({
    animation: "slide",
    controlNav: false,
    start: function(slider){
    jQuery('body').removeClass('loading');
    }
});
jQuery('#flexSlider2').flexslider({
    animation: "slide",
    controlNav: false,
    start: function(slider){
    jQuery('body').removeClass('loading');
    }
}); 

jQuery('#contSlider1').flexslider({
    animation: "swing",
    controlNav: false,
    directionNav: false,
    direction: "vertical",
    easing:'linear',
    prevText: " ",
    nextText: " ", 
    minItems: 2,
    maxItems: 2,
    move: 2,
    itemMargin: 0,
    pausePlay: true,
    pauseOnHover: true,
    slideshowSpeed:1000,
    animationSpeed:10000,      
});
jQuery('#contSlider2').flexslider({
    animation: "slide",
    controlNav: false,
    start: function(slider){
    jQuery('body').removeClass('loading');
    }
});   
jQuery('#flexCarousel').flexslider({
    animation: "slide",
    animationLoop: false,
    itemWidth: 200,
    itemMargin: 5,
    minItems: 2,
    maxItems: 6,
    slideshow: 1,
    move: 1,
    pausePlay: true,
    pauseText: 'Pause',
    playText: 'Play', 
    controlNav: false,
    start: function(slider){
        jQuery('body').removeClass('loading');
        if (slider.pagingCount === 1) slider.addClass('flex-centered');
    }
});

jQuery('#flexCarousel1').flexslider({
    animation: "slide",
    animationLoop: false,
    itemWidth: 168,
        itemMargin: 20,
        minItems:1,
        maxItems: 4,
        slideshow: 1,
        move: 1,
        controlNav: false,
        start: function(slider){
            jQuery('body').removeClass('loading');
            //if (slider.pagingCount === 1) slider.addClass('flex-centered');
        }
});

jQuery('#breaking_news').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: true,
    directionNav: false,
    direction: "horizontal",
    slideshowSpeed: 7000,
    animationSpeed: 600,
        initDelay: 1000,
        pausePlay: true,
    pauseText: '',
    playText: '',
    pauseOnHover: false
});
/*
jQuery('#galleryCarousel').flexslider({
        animation: "fade",
        controlNav: "thumbnails",
        start: function(slider){
            jQuery('body').removeClass('loading');
        }
});*/
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

jQuery('#galleryCarousel .view-content ul li').each(function (){
            //alert(jQuery(this).children().attr('src'));
			//var alt = jQuery(this).children("img").attr("alt");
            jQuery(this).attr('data-thumb', jQuery(this).children().attr('src'));
			jQuery(this).attr('data-thumb-alt', jQuery(this).children("img").attr("alt"));

        });
        // Gallery
        jQuery('#galleryCarousel').flexslider({
            animation: "fade",
            controlNav: "thumbnails",
            start: function (slider) {
                jQuery('body').removeClass('loading');
            }
        });

/* For home about title remove added by shubh tiwari as 06-09-2019 */       
jQuery(".path-frontpage .node--promoted h2:first").remove();
jQuery('.footer-top-container ul').removeClass('menu');
//for document breadcum anchor disable
var langCode = drupalSettings.path.currentLanguage;
var basePath = drupalSettings.path.baseUrl;
if(langCode =='en'){
    var second_secgment = jQuery('.cmf-site-breadcrumb li:nth-child(2)').text();
var third_secgment = jQuery('.cmf-site-breadcrumb li:nth-child(3)').text();
var fourth_secgment = jQuery('.cmf-site-breadcrumb li:nth-child(4)').text();
var notifi_link = "<a href='/en/reports-documents/notifications'>Notifications</a>";
var order_link = "<a href='/en/reports-documents/orders-circulars'>Orders/Circulars</a>";
var news_link2 = "<a href='/en/media/announcements-news'>Announcements/News</a>";
var news_link = "Announcements/News";
if(jQuery.trim(second_secgment) == "Reports documents"){
	jQuery('.cmf-site-breadcrumb li:nth-child(2)').text('Reports/documents');
}
if(jQuery.trim(second_secgment) == "Competition awards"){
	jQuery('.cmf-site-breadcrumb li:nth-child(2)').text('Competition & awards');
}
if(third_secgment==980){
	jQuery('.cmf-site-breadcrumb li:nth-child(3)').html(notifi_link);
	jQuery('.page-title').text('Archived Notifications');
}
if(third_secgment==981){
	jQuery('.cmf-site-breadcrumb li:nth-child(3)').html(order_link);
	jQuery('.page-title').text('Archived Orders/Circulars');
}
if(jQuery.trim(third_secgment) == "Announcement"){
		jQuery('.cmf-site-breadcrumb li:nth-child(3)').html(news_link);
}
if(jQuery.trim(third_secgment) == "Announcement" && jQuery.trim(fourth_secgment) == "Archived"){
		jQuery('.cmf-site-breadcrumb li:nth-child(3)').html(news_link2);
}
if(jQuery.trim(third_secgment) == "Profile honble minister"){
		jQuery('.cmf-site-breadcrumb li:nth-child(3)').text('Profile of hon\'ble minister');
}
if(jQuery.trim(third_secgment) == "Profile honble minister of state"){
		jQuery('.cmf-site-breadcrumb li:nth-child(3)').text('Profile of Hon\'ble minister of state');
}
var whats_new_secgment = jQuery('.quicktabs-tabs li:nth-child(1)').text();
if(jQuery.trim(whats_new_secgment) == "What's New"){
	jQuery('.more-link').attr('title', 'Read More What\'s New');
}
jQuery('a.hi-dir[rel="202"]').hide();
jQuery('a.eng-dir[rel="201"]').show();
jQuery('#header-nav li:nth-child(6) ul li a').attr('title', 'Click here for हिन्दी version');
jQuery('#header-nav li:nth-child(6) ul li a').attr("lang", "hi");
jQuery('#header-nav li:nth-child(6) ul li a').text('हिन्दी');
jQuery('#header-nav li:nth-child(6) ul li a').attr("href", basePath); 
jQuery(".gallery-heading a").attr("href", "/en/media/photo-gallery");
jQuery(".video-heading a").attr("href", "/en/media/video-gallery");
jQuery('a.org-gt[rel="203"]').attr("href", "/en/organizations/dgt");
jQuery('a.org-ncvet[rel="204"]').attr("href", "/en/organisations/ncvet");
jQuery('a.org-nsdc[rel="205"]').attr("href", "/en/organizations/nsdc");
jQuery('a.siosi-asa[rel="206"]').attr("href", "/en/schemes-initiatives/Other-Schemes-and-Initiatives/aspirational-skilling-abhiyan");
 jQuery(document).ready(function(){ 
        jQuery("#parentHorizontalTab a").click(function(e){
			var tab_name = jQuery(this).text();
			jQuery('.more-link a').removeAttr('title');
			jQuery('.more-link a').attr('title', 'Read More '+tab_name);
        });
    });

}else{
var second_secgment = jQuery('.cmf-site-breadcrumb li:nth-child(2)').text();
//console.log(second_secgment);
var third_secgment = jQuery('.cmf-site-breadcrumb li:nth-child(3)').text();
//console.log(third_secgment);
var fourth_secgment = jQuery('.cmf-site-breadcrumb li:nth-child(4)').text();
var notifi_link = "<a href='/reports-documents/notifications'> अधिसूचनाएँ</a>";
var order_link = "<a href='/reports-documents/orders-circulars'> आदेश/परिपत्र</a>";
var news_link2 = "<a href='/media/announcements-news'> घोषणाएँ / समाचार</a>";
var gallery_archive = "<a href='/media/photo-gallery'> फोटो गैलरी</a>";
var news_link = "घोषणाएँ / समाचार";
var event_link ="नवीनतम घटनाओं";
if(jQuery.trim(second_secgment) == "मंत्री"){
	jQuery('.page-title').text('मंत्री');
}
if(jQuery.trim(second_secgment) == "Reports documents"){
	jQuery('.cmf-site-breadcrumb li:nth-child(2)').text(' रिपोर्ट/दस्तावेज');
}
if(jQuery.trim(second_secgment) == "Useful links"){
	jQuery('.cmf-site-breadcrumb li:nth-child(2)').text(' उपयोगार्थ लिंक');
}
if(jQuery.trim(second_secgment) == "Competition awards"){
	jQuery('.cmf-site-breadcrumb li:nth-child(2)').text(' प्रतियोगिता और पुरस्कार');
}
if(jQuery.trim(second_secgment) == "Organizations" || jQuery.trim(second_secgment) == "Organisations"){
	jQuery('.cmf-site-breadcrumb li:nth-child(2)').text(' संस्‍थान');
}
if(jQuery.trim(second_secgment) == "Schemes initiatives"){
	jQuery('.cmf-site-breadcrumb li:nth-child(2)').text('योजनाओं की पहल');
}
if(jQuery.trim(second_secgment) == "Media"){
	jQuery('.cmf-site-breadcrumb li:nth-child(2)').text('मीडिया');
}
if(third_secgment==980){
	jQuery('.cmf-site-breadcrumb li:nth-child(3)').html(notifi_link);
	jQuery('.page-title').text(' संग्रहीत अधिसूचनाएँ');
}
if(third_secgment==981){
	jQuery('.cmf-site-breadcrumb li:nth-child(3)').html(order_link);
	jQuery('.page-title').text('संग्रहीत आदेश/परिपत्र');
}

if(jQuery.trim(third_secgment) =='Policies'){
	jQuery('.cmf-site-breadcrumb li:nth-child(3)').text('नीतियां');
}
if(jQuery.trim(third_secgment) =='Skill Engagements'){
	jQuery('.cmf-site-breadcrumb li:nth-child(3)').text('कौशल संलग्‍नताएं');
}

if(jQuery.trim(third_secgment) == "Schemes initiatives through nsdc"){
	jQuery('.cmf-site-breadcrumb li:nth-child(3)').text('अल्पकालिक प्रशिक्षण योजनाएं/पहलें');
}

if(jQuery.trim(third_secgment) == "Schemes initiatives through DGT"){
	jQuery('.cmf-site-breadcrumb li:nth-child(3)').text('दीर्घकालिक प्रशिक्षण योजनाएं/पहलें');
}

if(jQuery.trim(third_secgment) == "Apprenticeship training"){
	jQuery('.cmf-site-breadcrumb li:nth-child(3)').text('शिक्षुता प्रशिक्षण');
}

if(jQuery.trim(third_secgment) == "Schemes related to Entrepreneurship"){
	jQuery('.cmf-site-breadcrumb li:nth-child(3)').text('उद्यमिता योजनाएं');
}

if(jQuery.trim(third_secgment) == "Other Schemes and Initiatives"){
	jQuery('.cmf-site-breadcrumb li:nth-child(3)').text('अन्य योजनाएं/पहलें');
}

if(jQuery.trim(third_secgment) == "घोषणा"){
		jQuery('.cmf-site-breadcrumb li:nth-child(3)').html(news_link);
		jQuery('.page-title').text('घोषणाएँ / समाचार');
}

if(jQuery.trim(third_secgment) == "फोटो गैलरी"){
		jQuery('.page-title').text('फोटो गैलरी');
}

if(jQuery.trim(second_secgment) == "निविदाएं"){
		jQuery('.page-title').text('निविदाएं');
}

if(jQuery.trim(third_secgment) == "प्रेस विज्ञप्ति"){
		//jQuery('.cmf-site-breadcrumb li:nth-child(3)').html(news_link);
		jQuery('.page-title').text('प्रेस विज्ञप्ति');
}

if(jQuery.trim(second_secgment) == "आयोजन"){
		jQuery('.cmf-site-breadcrumb li:nth-child(2)').html(event_link);
		jQuery('.page-title').text('नवीनतम घटनाओं');
}

if(jQuery.trim(second_secgment)=='नवीनतम घटनाओं' && jQuery.trim(third_secgment) == "Archived"){
	jQuery('.cmf-site-breadcrumb li:nth-child(2)').html(order_link);
	jQuery('.page-title').text('संग्रहीत नवीनतम घटनाओं');
}

if(jQuery.trim(third_secgment) == "घोषणा" && jQuery.trim(fourth_secgment) == "Archived"){
	    jQuery('.cmf-site-breadcrumb li:nth-child(3)').html(news_link2);
		jQuery('.cmf-site-breadcrumb li:nth-child(4)').html('संग्रहीत घोषणाएँ / समाचार');
		jQuery('.page-title').html('संग्रहीत घोषणाएँ / समाचार');
}

if(jQuery.trim(third_secgment) == 981 && jQuery.trim(fourth_secgment) == "Archived"){
		jQuery('.cmf-site-breadcrumb li:nth-child(4)').html('संग्रहीत आदेश/परिपत्र');
}

if(jQuery.trim(third_secgment) == 980 && jQuery.trim(fourth_secgment) == "Archived"){
		jQuery('.cmf-site-breadcrumb li:nth-child(4)').html('संग्रहीत अधिसूचनाएँ');
}

if(jQuery.trim(third_secgment) == "प्रेस विज्ञप्ति" && jQuery.trim(fourth_secgment) == "Archived"){
		jQuery('.cmf-site-breadcrumb li:nth-child(4)').html('संग्रहीत प्रेस विज्ञप्ति');
		jQuery('.page-title').text('संग्रहीत प्रेस विज्ञप्ति');
}

if(jQuery.trim(second_secgment) == "निविदाएं" && jQuery.trim(third_secgment) == "Archived"){
		jQuery('.cmf-site-breadcrumb li:nth-child(3)').html('संग्रहीत निविदाएं');
		jQuery('.page-title').text('संग्रहीत निविदाएं');
}

if(jQuery.trim(third_secgment) == "Photo gallery list" && jQuery.trim(fourth_secgment) == "Archived"){
		 jQuery('.cmf-site-breadcrumb li:nth-child(3)').html(gallery_archive);
		jQuery('.cmf-site-breadcrumb li:nth-child(4)').html('संग्रहीत फोटो गैलरी');
}

if(jQuery.trim(third_secgment) == "Profile honble minister"){
		jQuery('.cmf-site-breadcrumb li:nth-child(3)').text('माननीय मंत्री जी का प्रोफाइल');
}
if(jQuery.trim(third_secgment) == "Profile honble minister of state"){
		jQuery('.cmf-site-breadcrumb li:nth-child(3)').text('माननीय राज्य मंत्री का प्रोफाइल');
}

jQuery('.more-link a').text('अधिक पढ़ें');
jQuery('.more-link').attr('title', 'अधिक पढ़ें नया क्या है');
jQuery('.profile-btn a').text('प्रोफ़ाइल पर जाएँ');
jQuery('.press-arch a').text('संग्रहीत प्रेस विज्ञप्ति');
jQuery('.news-archive a').text('संग्रहीत घोषणाएँ / समाचार');
jQuery('.tender-arch a').text('संग्रहीत निविदाएं');
jQuery('.tender-arch a').attr('title', ' संग्रहीत निविदाएं');
jQuery('.gal-arch a').text('संग्रहीत फोटो गैलरी');
jQuery('.gal-arch a').attr('title', 'संग्रहीत फोटो गैलरी');
//jQuery(".gallery-heading a").attr("href", "/media/photo-gallery");
//jQuery(".video-heading a").attr("href", "/media/video-gallery");
jQuery('#header-nav li:nth-child(5) a').attr("href", "/sitemap");
/* jQuery('#header-nav li:nth-child(6) ul li a').attr('title', 'Click here for english version.');
jQuery('#header-nav li:nth-child(6) ul li a').attr("lang", "en");
jQuery('#header-nav li:nth-child(6) ul li a').text('English');
jQuery('#header-nav li:nth-child(6) ul li a').attr("href", basePath.'/'+langCode); */
// for Teliphone Directory
jQuery('a.eng-dir[rel="201"]').hide();
jQuery('a.hi-dir[rel="202"]').show();
// for national portal link on home page
/* jQuery('a.org-gt[rel="203"]').attr("href", "/organizations/dgt");
jQuery('a.org-nsda[rel="204"]').attr("href", "/organizations/nsda");
jQuery('a.org-nsdc[rel="205"]').attr("href", "/organizations/nsdc");
jQuery('a.siosi-asa[rel="206"]').attr("href", "/schemes-initiatives/Other-Schemes-and-Initiatives/aspirational-skilling-abhiyan"); */
jQuery(document).ready(function(){ 
        jQuery("#parentHorizontalTab a").click(function(e){
			var tab_name = jQuery(this).text();
			jQuery('.more-link a').removeAttr('title');
			jQuery('.more-link a').attr('title', 'अधिक पढ़ें '+tab_name);
			jQuery('.more-link a').text('अधिक पढ़ें');
        });
		
    });
}
jQuery("form").attr('autocomplete', 'off');
jQuery("#edit-pass").attr('autocomplete', 'off');
