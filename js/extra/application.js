$(function(){
	$("a[href='#written']").click(function(e) {
		e.preventDefault();
		$('#popup').bPopup({
			contentContainer: $('#popup > div'),
			position: ['auto', 'auto'],
			follow: [false, false],
			loadUrl:'written.html'
		});
	});
});
