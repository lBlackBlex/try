setInterval(addCoverLink, 500);

function addCoverLink() {
	$('#fbProfileCover').not('[data-mog-covers]').each(function () {
		$(this).attr('data-mog-covers', 1);
		var text = $('.fbTimelineEditCoverButton').text().trim();
		if (!text) {
			return;
		}
		
		//text = 'Easter Cover Photos';
		
		$(this).append(
				'<a target="_blank" class="mog-covers-link" href="https://www.mogicons.com/covers?utm_source=chrome&utm_medium=extension&utm_campaign=covers" title="Cover Photos">' + 
				'	<i style="margin-left: -2px" class="mog-emoji mog-emoji-1f4f7 mog-emoji-inline"></i>&nbsp; ' + text +
				'</a>');
	});
}