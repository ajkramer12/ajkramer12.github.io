$(document).ready(function(){
	$('#id-1').click(function(){
		console.log('Type Message Here'); // adds line to console
		alert('Type message here'); // alert window
	}); // end id-1 click
	
	
	
	$('#id-2').hover(function(){
		$('#id-2').css({
			backgroundColor: 'red'
		}); // end css
	}, function(){
		console.log('Type Message Here'); // adds line to console
	}); // end id-2 hover
	
	
	
	$('#id-3').click(function(){
		$('#id-4').hide(1000);	// hides object
	}); // end id-3 click
	
	
	
	$('#id-5').click(function(){
		$('#id-4').show(1000);	// hides object
	}); // end id-5 click
	
	
	
	$('#id-6').click(function(){
		$('#id-7').animate({
			opacity: '0.25',
			height: 'toggle'
		}, 5000, 'swing', function(){
			$('#id-7').css({
				opacity: '1'
			}); // end id-7 css
			$('#id-6').css({
				backgroundColor: 'red'
			}); // end id-6 css
		}); //end id-7 animate
	}); // end id-6 click
	
	
	
	$('#id-8').click(function(){
		$('#id-9').removeClass('class-1').addClass('class-2');
		$('.jumbotron h1').text('Your Text or HTML Here'); // inner HTML
		$('.jumbotron p').prepend('Your Text or HTML Here'); // adds before the the tag
		$('.jumbotron p').apend('Your Text or HTML Here'); // adds after the tag
		$('.jumbotron-btn').replaceWith(); // removes object
		$('.jumbotron-btn').replaceWith('Your Text or HTML Here'); // removes object
	}); // end id-8 click
	
	
	
	
	$('#id-10').hover(function(){
		$('#id-10').attr({
			'src' : 'img/id-11.jpg',
			'class' : 'class1 class2'	// resets class to whatever you declare here, does not add to
		}); // end attr on
	}, function(){
		$('#id-10').attr({
			'src' : 'img/id-10.jpg',
			'class' : 'class1'			// resets class to whatever you declare here, does not add to
		}); // end attr off
	}); // end id-10 hover
	
}); // end ready





class='search-group'	//surrounds dropdown menu, label and spans

<span class="help-block"></span>






$(document).ready(function(){

	$('#dropdown<select>id').change(function(){
		if ($('#dropdown<select>id').val() == 'option1'){
			$('.search-group .help-block').text('Insert Text');
		} else if ($('#dropdown<select>id').val() == 'option2'){
			$('.search-group .help-block').text('Insert Text');
		} else {
			$('.search-group .help-block').text('');
		}
	}); // end change

}); // end ready






//required field
identification class for input group (lable field help span)
id on field



$(document).ready(function(){

	$('#id').focusout(function(){
		if ($('#id').val().length == 0){
			$('.idclass .help-block').text('Insert Text');
			$(".idclass").attr({
				class :	'has-error ...'
			}); //end attr
		} else {
			$('.idclass .help-block').text('');
			$(".idclass").attr({
				class :	'has-success ...'
			}); //end attr
		}
	}); // end focus out
	
	$('button').click(function(submit){
		if ($('#id').val().length == 0){
			$('.idclass .help-block').text('Insert Text');
			$(".idclass").attr({
				class :	'has-error ...'
			}); //end attr
			submit.preventDefault();
		} else {
			$('#modalid').modal();
			submit.preventDefault();	//only needed here because the form does not actually submitt
		}
	}); // end click

}); // end ready
