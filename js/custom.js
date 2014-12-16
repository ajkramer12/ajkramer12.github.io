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
	
	
	
	
	
	
	
	
	// Assignment 3
		var validEntry = 0;
	
		// Require Number Fields
		$('#spd').focusout(function(){
			if ($.isNumeric($('#spd').val()) == false || $('#spd').val() == 0){
				$('.validate-number .help-block').text('Please enter a numeric value other than 0.');
				$('.validate-number').addClass('has-error');
				$('.validate-number').removeClass('has-success');
			} else {
				$('.validate-number .help-block').text('');
				$(".validate-number").addClass('has-success');
				$(".validate-number").removeClass('has-error');
			}
		}); // end e-mail focus out
		
		$('#begin-game').click(function(submit){
			if ($.isNumeric($('#spd').val()) == false || $('#spd').val() == 0){
				$('.validate-number .help-block').text('Please enter a numeric value other than 0.');
				$('.validate-number').addClass('has-error');
				$('.validate-number').removeClass('has-success');
			} else {
				validEntry = 1;
			}
			submit.preventDefault();	//only needed here because the form does not actually submit
		
			var enteredSpeed = 750;	// default time for for laser to move from blaster to center of block
		
			if(validEntry == 1){
				enteredSpeed = (750 / $('#spd').val());
			
	
				$('canvas').addClass('game-canvas');
		
		
		
		
				$('canvas').drawRect({
					layer: true,
					name: 'laser',
					fillStyle: '#0c6',
					x: 375, y: 700,
					width: 12, height: 0
				});
				
				
				
				$('canvas').drawRect({
					layer: true,
					name: 'block0',
					fillStyle: '#f90',
					x: 37, y: 250,
					width: 75, height: 500
				}).drawRect({
					layer: true,
					name: 'block1',
					fillStyle: '#f90',
					x: 112, y: 250,
					width: 75, height: 500
				}).drawRect({
					layer: true,
					name: 'block2',
					fillStyle: '#f90',
					x: 187, y: 250,
					width: 75, height: 500
				}).drawRect({
					layer: true,
					name: 'block3',
					fillStyle: '#f90',
					x: 262, y: 250,
					width: 75, height: 500
				}).drawRect({
					layer: true,
					name: 'block4',
					fillStyle: '#f90',
					x: 337, y: 250,
					width: 75, height: 500
				}).drawRect({
					layer: true,
					name: 'block5',
					fillStyle: '#f90',
					x: 412, y: 250,
					width: 75, height: 500
				}).drawRect({
					layer: true,
					name: 'block6',
					fillStyle: '#f90',
					x: 487, y: 250,
					width: 75, height: 500
				}).drawRect({
					layer: true,
					name: 'block7',
					fillStyle: '#f90',
					x: 562, y: 250,
					width: 75, height: 500
				}).drawRect({
					layer: true,
					name: 'block8',
					fillStyle: '#f90',
					x: 637, y: 250,
					width: 75, height: 500
				}).drawRect({
					layer: true,
					name: 'block9',
					fillStyle: '#f90',
					x: 712, y: 250,
					width: 75, height: 500
				});
				
				
				
				$('canvas').drawPolygon({
					layer: true,
					name: 'blaster',
					fillStyle: '#003',
					strokeStyle: '#999',
					strokeWidth: 3,
					x: 375, y: 700,
					radius: 50,
					sides: 3,
					concavity: -0.5,
					click: function(layer) {
						$('canvas').animateLayer('laser', { fillStyle: '#0c6', x: layer.x, y: 700, height: 75 }, 10, function(layer) {
							$(this).animateLayer(layer, { y: 150 }, enteredSpeed, function(layer) {
								$(this).animateLayer(layer, { fillStyle: '#fff', height: 0 }, 100, function(layer) {
									if (layer.x < 75) {
										$(this).animateLayer('block0', { height: 0, width: 0 }, 100); 
									} 
									if (layer.x >= 75 && layer.x < 150) {
										$(this).animateLayer('block1', { height: 0, width: 0 }, 100); 
									} 
									if (layer.x >= 150 && layer.x < 225) {
										$(this).animateLayer('block2', { height: 0, width: 0 }, 100); 
									} 
									if (layer.x >= 225 && layer.x < 300) {
										$(this).animateLayer('block3', { height: 0, width: 0 }, 100); 
									} 
									if (layer.x >= 300 && layer.x < 375) {
										$(this).animateLayer('block4', { height: 0, width: 0 }, 100); 
									} 
									if (layer.x >= 375 && layer.x < 450) {
										$(this).animateLayer('block5', { height: 0, width: 0 }, 100); 
									} 
									if (layer.x >= 450 && layer.x < 525) {
										$(this).animateLayer('block6', { height: 0, width: 0 }, 100); 
									} 
									if (layer.x >= 525 && layer.x < 600) {
										$(this).animateLayer('block7', { height: 0, width: 0 }, 100); 
									} 
									if (layer.x >= 600 && layer.x < 675) {
										$(this).animateLayer('block8', { height: 0, width: 0 }, 100); 
									} 
									if (layer.x >= 675 && layer.x < 750) {
										$(this).animateLayer('block9', { height: 0, width: 0 }, 100); 
									} 
									// end animate laser 4
								}); //end animate laser 3
							}); //end animate laser 2
						}); // end animate laser 1
					}, //end click blaster
					
					mousemove: function(layer) {
						layer.x = layer.eventX;
					} // end mousemove
				}); // end Draw Polygon
			}
		}); // end submit click (Begin Game)
	
		$('#clear').click(function(){
			$('canvas').clearCanvas();
		}); // end click clear
}); // end ready


