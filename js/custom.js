$(document).ready(function(){

	// Require E-mail and Experience Fields
	$('#eml').focusout(function(){
		if ($('#eml').val().length == 0){
			$('.validate-email .help-block').text('Please enter a valid e-mail address.');
			$(".validate-email").addClass('has-error');
			$(".validate-email").removeClass('has-success');
		} else {
			$('.validate-email .help-block').text('');
			$(".validate-email").addClass('has-success');
			$(".validate-email").removeClass('has-error');
		}
	}); // end e-mail focus out
	
	$('#exp').focusout(function(){
		if ($('#exp').val() == 'none'){
			$('.validate-experience .help-block').text('Please choose an experience level.');
			$(".validate-experience").addClass('has-error');
			$(".validate-experience").removeClass('has-success');
		} else {
			$('.validate-experience .help-block').text('');
			$(".validate-experience").addClass('has-success');
			$(".validate-experience").removeClass('has-error');
		}
	}); // end experience focus out
	
	$('#form-submit').click(function(submit){
		if ($('#eml').val().length == 0){
			$('.validate-email .help-block').text('Please enter a valid e-mail address.');
			$('.validate-email').addClass('has-error');
			$('.validate-email').removeClass('has-success');
			submit.preventDefault();
		} else if ($('#exp').val() == 'none'){
			$('.validate-experience .help-block').text('Please choose an experience level.');
			$(".validate-experience").addClass('has-error');
			$(".validate-experience").removeClass('has-success');
			submit.preventDefault();
		} else {
			$('#contact-form').html('<h4>Thank you for contacting us!</h4><p>You will hear from us shortly.</p>');
			submit.preventDefault();	//only needed here because the form does not actually submit
		}
	}); // end submit click
	
	
	
	
	
	
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
	$('.jumbotron img').hover(function(){
		$('.jumbotron img').attr({
			'src' : 'images/mask.jpg'
		}); // end attr on
	}, function(){
		$('.jumbotron img').attr({
			'src' : 'images/enguarde.jpg'
		}); // end attr off
	}); // end mask-img hover
	
	
	
	
	// Highlight paragraphs that reference the user's selected sword.
	$('#fav-null').click(function(){
		$('p').removeClass('bg-primary')
	}); // end fav-null click
	
	$('#fav-foil').click(function(){
		$('p').removeClass('bg-primary')
		$('p:contains(foil)').addClass('bg-primary');
	}); // end fav-foil click
	
	$('#fav-epee').click(function(){
		$('p').removeClass('bg-primary')
		$('p:contains("epee")').addClass('bg-primary');
	}); // end fav-epee click
	
	$('#fav-sabre').click(function(){
		$('p').removeClass('bg-primary')
		$('p:contains(sabre)').addClass('bg-primary');
	}); // end fav-sabre click
	
	
	// Expand and highlight equipment images when the mouse hovers over them
	$(".equipment img").hover(function(){
		$(this).height(400);
		$(this).addClass('thumbnail');
	}, function(){
		$(this).height(200);
		$(this).removeClass('thumbnail');
	}); // end img hover
	
}); // end ready
