// Copyright 2016, Vasil Nikolov (phpnikolov@gmail.com)

// Flag to prevent Facebook events
var STOP_PROPAGATION = false;

var mogicons = new Mogicons(EMOJI_LIST);

// Check for new togglers evry 1 sec
setInterval(function () {
	mogicons.createTogglers();
}, 1000);

$('body').bindFirst('mousedown', function (e) {
	STOP_PROPAGATION = false;

	if (e.button !== 0) {
		return;
	}
	var el = e.target || e.srcElement;

	if ($(el).hasClass('mog-toggler') || $(el).parents('#mog-container').length > 0 || $(el).parents('.mog-toggler').length > 0) {
		STOP_PROPAGATION = true;
		e.stopPropagation();
	}
	else {
		mogicons.hideEmopop();
	}
});

$('body').bindFirst('mouseup', function (e) {
	if (STOP_PROPAGATION) {
		e.stopPropagation();
	}
});

$('body').bindFirst('click', function (e) {
	if (STOP_PROPAGATION) {
		e.stopPropagation();
	}
	else {
		setTimeout(function () {
			mogicons.createTogglers();
		}, 300);
	}
});

$(document).bindFirst('keydown keyup', function (e) {
	if (e.keyCode === 27 || e.keyCode === 13) { // escape && enter
		mogicons.hideEmopop();
	}
});

