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
	
	
	
	
	
	$('.remove-ads').click(function(){
		$('aside').hide(500);
		//$('.remove-ads').text('Show Ads');
		//$('remove-ads').attr({
			//class : 'show-ads'
		//}); // end remove-ads attr
	}); // end remove-ads click
	
	//$('.show-ads').click(function(){
		//$('aside').show(500);
		//$('.show-ads').text('Remove Ads');
		//$('show-ads').attr({
			//'class' : 'remove-ads'
		//}); // end show-ads attr
	//}); // end show-ads click
	
	
	
	
	
	// needs another effect
	$('#mask-img').hover(function(){
		$('#mask-img').attr({
			'src' : 'images/mask.jpg'
		}); // end attr on
	}, function(){
		$('#mask-img').attr({
			'src' : 'images/enguarde.jpg'
		}); // end attr off
	}); // end mask-img hover
	
	
	
	
	
	//finish
	$('#fav-null').click(function(){
		$('p').removeClass('strong')
	}); // end fav-null click
	
	$('#fav-foil').click(function(){
		$('p').addClass('bg-success');
	}); // end fav-foil click
	
	
	
	
	$(".equipment img").hover(function(){
		$(this).height(400);
	}, function(){
		$(this).height(200);
	}); // end img hover
	
	//$("img").one("click", function(){
	//	$(this).height(200);
	//}); // end img one
}); // end ready
