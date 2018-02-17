$(document).ready(function () {
    $("#subNavToggle, .scroll-on-page-link").click(cardToggle);
});


function cardToggle() {
    if($("#subNavToggle").css("display") != "none"){
        $(".subNav ul").toggle("slow", function(){});
        $("article, .cards").fadeToggle("slow", function(){});
    }
}



// Copied from Refill: Scroll on Page
(function (jQuery) {
    jQuery.mark = {
        jump: function (options) {
            var defaults = {
                selector: 'a.scroll-on-page-link'
            };
            if (typeof options == 'string') {
                defaults.selector = options;
            }

            options = jQuery.extend(defaults, options);
            return jQuery(options.selector).click(function (e) {
                var jumpobj = jQuery(this);
                var target = jumpobj.attr('href');
                var thespeed = 1000;
                var offset = jQuery(target).offset().top;
                jQuery('html,body').animate({
                    scrollTop: offset
                }, thespeed, 'swing');
                e.preventDefault();
            });
        }
    };
})(jQuery);


jQuery(function(){
    jQuery.mark.jump();
});
//End Refill copy