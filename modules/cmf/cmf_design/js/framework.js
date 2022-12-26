
// date 24-2-2016   code for add class in mega menu  written by waliullah 
/*
( function($) {
$(document).ready(function(){
	//alert('hello');
if($('.nav-menu li ul[class="sub-nav-group"] li ul[class="sub-nav-group"] li').find('li')){
 alert('hello');	
}
			
});

} ) ( jQuery );
*/
// code end
	var contact = '';
	contact +='<p><strong>Ministry of Skill Development &amp; Entrepreneurship</strong><br>';
	contact +='<strong>Govt. of India,</strong><br>';
	contact +='Shram Shakti Bhawan,<br>';
	contact +='Rafi Marg,<br>';
	contact +='New Delhi-110001';
	contact +='</p>';
	var html='';
	html += '<div class="google-find">';
	html +='<form method="get" action="https://www.google.com/search" target="_blank">';
	html +='<label for="search_key_g" class="notdisplay">Search</label>';
	html +='<input type="text" name="q" value="" id="search_key_g"/> ';
	html +='<input type="submit" value="Search" class="submit" />'; 
	html +='<div class="">';
	html +='<input type="radio" name="sitesearch" value="" id="the_web"/>';
	html +='<label for="the_web">The Web</label>'; 
	html +='<input type="radio" name="sitesearch" value="india.gov.in" checked id="the_domain"/> <label for="the_domain"> INDIA.GOV.IN</label>';
	html +='</div>';
	html +='</form>';
	html +='</div>';
	html +='<div class="find">';
	html +='<form id="search-form" method="get" action="/search/site-search" autocomplete="off">';
	html +='<label for="search_key" class="notdisplay"></label>';
	html +='<input type="text" placeholder="Search" name="keys" id="edit-keys" autocomplete="off" required />';
	html +='<input type="submit" value="Search" class="bttn-search"/>';
	html +='</form>'
	html +='<div id="auto_suggesion"></div>';
	html +='</div>';

	var lastPart = function($url) {
			var url = $url;
			// Split URL into parts and store them as array 
			var parts = url.split("/");
			// Get value of last part
			var last_part = parts[parts.length - 1];
			// In case there is a '/' at the end
			if(last_part === '') last_part = parts[parts.length - 2];
			return last_part;
	  }
	  
jQuery(document).ready(function(){
	jQuery("#edit-search-block-form--2").attr("placeholder", "Search - Keyword, Phrase");
	jQuery(".gtranslate select").attr("id","gtranslate");			   
	jQuery("#gtranslate").before('<label class="notdisplay" for="gtranslate">Google Translate</label>');
	//contrast
	if(getCookie('contrast') == 0 || getCookie('contrast') == null){
	jQuery(".light").hide();
	jQuery(".dark").show();
    }else{
	jQuery(".light").show();
	jQuery(".dark").hide();
	
    }
    jQuery(".search-drop").css("display", "none");
    jQuery(".common-right ul li ul").css("visibility", "hidden");

// Fix Header

	var num = 36; //number of pixels before modifying styles
    jQuery(window).bind('scroll', function () {
        if (jQuery(window).scrollTop() > num) {
        jQuery('.fixed-wrapper').addClass('sticky');
		
    
        } else {
        jQuery('.fixed-wrapper').removeClass('sticky');
    
        }
    });		
			
jQuery(document).ready(function(){

jQuery("#main-menu div > ul" ).attr("id","nav");
//
	dropdown1('nav','hover',10);
//
dropdown1("header-nav", "hover", 20);

});
		
	
// Mobile Nav	
jQuery('.sub-menu').append('<i class="fa fa-caret-right"></i>');
	jQuery('.toggle-nav-bar').click(function(){	
	jQuery('#nav').slideToggle();
	//jQuery('#nav li').removeClass('open');
    
	/*jQuery("#nav li").click(function(){
		jQuery("#nav li").removeClass('open');
		jQuery(this).addClass('open');
	}); */
	
		jQuery("#nav li").hover(
		function() {
		jQuery( this  ).addClass( "open" );
		}, function() {
		jQuery( this ).removeClass( "open" );
		}
		);		
	});
	
	


	
		jQuery("#nav .btn-more").focus(
		function() {
		jQuery( this  ).addClass( "opened" );
		}, function() {
		jQuery( this ).removeClass( "opened" );
		}
		);	


//Skip Content
jQuery('a[href^="#skipCont"]').click(function(){
	jQuery('html,body').animate({ scrollTop: jQuery(this.hash).offset().top}, 500);
	return false;
	e.preventDefault();
});

// Serach top remove when we goes to the saech page 
var pathname = '';
pathname = lastPart(window.location.pathname);
//console.log(pathname);
if(jQuery.trim(pathname) == "site-search"){
	jQuery("#header-nav li").eq(1).remove();
	jQuery('.cmf-site-breadcrumb li:nth-child(2)').remove();
	//jQuery(".views-field-body").addClass('msde-contact');
	//jQuery(".msde-contact").css('display', 'none');
	//jQuery('.organization-chart').append(contact);
	
}else{
	jQuery('.search-drop').append(html);
	//jQuery(".views-field-body").removeClass('msde-contact');
}

// Toggle Search
jQuery("#toggleSearch").click(function(e){
        jQuery(".search-drop").toggle();
        e.stopPropagation();
    });
 jQuery(document).click(function(e) {
        if (!jQuery(e.target).is('.search-drop, .search-drop *')) {
            jQuery(".search-drop").hide();
        }
    });


});




jQuery(document).ready(function(){
	
	jQuery('.lang_select').change(function() {
          var url = jQuery(this).val(); // get selected value
          if (url) { // require a URL
              window.location = url; // redirect
          }
          return false;
      });
	

});


//Drop down menu for Keyboard accessing

function dropdown1(dropdownId, hoverClass, mouseOffDelay) { 
	if(dropdown = document.getElementById(dropdownId)) {
		var listItems = dropdown.getElementsByTagName('li');
		for(var i = 0; i < listItems.length; i++) {
			listItems[i].onmouseover = function() { this.className = addClass(this); }
			listItems[i].onmouseout = function() {
				var that = this;
				setTimeout(function() { that.className = removeClass(that); }, mouseOffDelay);
				this.className = that.className;
			}
			var anchor = listItems[i].getElementsByTagName('a');
			anchor = anchor[0];
			anchor.onfocus = function() { tabOn(this.parentNode); }
			anchor.onblur = function() { tabOff(this.parentNode); }
		}
	}
	
	function tabOn(li) {
		if(li.nodeName == 'LI') {
			li.className = addClass(li);
			tabOn(li.parentNode.parentNode);
		}
	}
	
	function tabOff(li) {
		if(li.nodeName == 'LI') {
			li.className = removeClass(li);
			tabOff(li.parentNode.parentNode);
		}
	}
	
	function addClass(li) { return li.className + ' ' + hoverClass; }
	function removeClass(li) { return li.className.replace(hoverClass, ""); }
}

//<![CDATA[
jQuery(function ()
{
jQuery('table').wrap('<div class="scroll-table1"></div>');
jQuery(".scroll-table1").before( "<div class='guide-text'>Swipe to view <i class='fa fa-long-arrow-right'></i></div>" );

});
//]]>


jQuery(document).ready(function(){
	var params = new Array();
	var count = 0;
	jQuery('table.views-table thead tr th').each(function () {
		params[count] = jQuery(this).text();
		count++;	
	});
	jQuery('table.views-table tbody tr').each(function () {
		for(var j = 1; j <= count; j++){
			jQuery('td:nth-child('+j+')', this).attr("data-label",params[j-1]);
		}
	});
});


function burstCache() {
var url = window.location.href;
var base_url='';
if(base_url != url && base_url+"/" != url){
if (!navigator.onLine) {
document.body.innerHTML = "Loading...";
window.location = "/";
}
}
}
window.onload = burstCache;






