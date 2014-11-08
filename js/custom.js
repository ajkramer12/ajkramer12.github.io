$(document).ready(function(){


	//$('#eml').focusout(function(){
		//if ($('#eml').val().length == 0){
			//$('.validate-email .help-block').text('Please enter a valid e-mail address.');
			//$(".validate-email").addClass({'has-error'});
			//$(".validate-email").removeClass({'has-success'});
		//} else {
			//$('.validate-email .help-block').text('');
			//$(".validate-email").addClass({'has-success'});
			//$(".validate-email").removeClass({'has-error'});
		//}
	//}); // end focus out
	
	//$('#form-submit').click(function(submit){
		//if ($('#eml').val().length == 0){
			//$('.validate-email .help-block').text('Please enter a valid e-mail address.');
			//$('.validate-email').addClass({'has-error'});
			//$('.validate-email').removeClass({'has-success'});
			//submit.preventDefault();
		//} else {
			//$('#contact-form').text('<h5>Thank you for contacting us!</h5><p>You will hear from us shortly.</p>');
			//submit.preventDefault();	//only needed here because the form does not actually submit
		//}
	//}); // end click
	
	
	
	
	// Hide or Show <aside> ads
	$('.remove-ads').click(function(){
		$('aside').hide(500);
		$('.remove-ads').addClass('hidden');
		$('.show-ads').removeClass('hidden');
	}); // end remove-ads click
	
	$('.show-ads').click(function(){
		$('aside').show(500);
		$('.show-ads').addClass('hidden');
		$('.remove-ads').removeClass('hidden');
	}); // end show-ads click
	
	
	
	
	
	// Change mask image on hover
	$('#mask-img').hover(function(){
		$('#mask-img').attr({
			'src' : 'images/mask.jpg'
		}); // end attr on
	}, function(){
		$('#mask-img').attr({
			'src' : 'images/enguarde.jpg'
		}); // end attr off
	}); // end mask-img hover
	
	
	
	
	//***************************************************************
	// Highlight paragraphs that reference the user's selected sword.
	$('#fav-null').click(function(){
		$('p').removeClass('bg-primary')
	}); // end fav-null click
	
	$('#fav-foil').click(function(){
		$('p').removeClass('bg-primary')
		$('p:contains(Foil)').addClass('bg-primary');
	}); // end fav-foil click
	
	$('#fav-epee').click(function(){
		$('p').removeClass('bg-primary')
		$('p:contains("&Eacute;p&eacute;e")').addClass('bg-primary');
	}); // end fav-epee click
	
	$('#fav-sabre').click(function(){
		$('p').removeClass('bg-primary')
		$('p:contains(Sabre)').addClass('bg-primary');
	}); // end fav-sabre click
	//*********************************************************************
	
	
	// Expand and highlight equipment images when the mouse hovers over them
	$(".equipment img").hover(function(){
		$(this).height(400);
		$(this).addClass('thumbnail');
	}, function(){
		$(this).height(200);
		$(this).removeClass('thumbnail');
	}); // end img hover
	
}); // end ready
