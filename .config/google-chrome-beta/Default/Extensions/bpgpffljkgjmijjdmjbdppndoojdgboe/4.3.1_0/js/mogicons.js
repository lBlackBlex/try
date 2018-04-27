// Copyright 2016, Vasil Nikolov (phpnikolov@gmail.com)

function Mogicons(emojiList) {
    var mogicons = this;
    var targetInput = null;

    var containerEl = $('<div id="mog-container"></div>');
    var navigationEl = $('<div id="mog-nav"></div>');

    $(containerEl).append(navigationEl, $('<i class="mog-bubble-arrow"></i>'));

    for (var t = 0; t < emojiList.length; t++) {
        var tabid = 'mog-tab-' + (t + 1);

        var navItemEl = $('<a>');
        $(navItemEl).addClass('mog-tab-icon-' + (t + 1));
        if (t === 0) {
            $(navItemEl).addClass('mog-active');
        }
        $(navItemEl).attr('data-hover', 'tooltip');
        $(navItemEl).attr('data-tooltip-alignh', 'center');
        $(navItemEl).attr('data-tooltip-content', emojiList[t].title);
        $(navItemEl).attr('data-tabid', tabid);
        $(navItemEl).click(function() {
            $('#mog-nav .mog-active').removeClass('mog-active');
            $(this).addClass('mog-active');
            $('.mog-emojis-tab.mog-active').removeClass('mog-active');
            $('#' + $(this).data('tabid')).addClass('mog-active');
        });

        var emojiSection = $('<div>');
        $(emojiSection).attr('id', tabid);
        $(emojiSection).addClass('mog-emojis-tab');
        if (t === 0) {
            $(emojiSection).addClass('mog-active');
        }

        if (emojiList[t].premium) {
            //$(emojiSection).append('<div class="mog-premium-content">You can find these emoticons on our website <a target="_blank" href="https://www.mogicons.com/?utm_source=chrome&utm_medium=extension&utm_campaign=emoticons">www.mogicons.com</a></div>');
        }

        for (var i = 0; i < emojiList[t].emojis.length; i++) {
            var emojiEl = $('<a class="mog-emoji"></a>');
            $(emojiEl).addClass(emojiList[t].emojis[i].className);
            $(emojiEl).text(emojiList[t].emojis[i].code);
            $(emojiEl).attr('data-tooltip-content', emojiList[t].emojis[i].label);
            $(emojiEl).attr('data-hover', 'tooltip');
            $(emojiEl).attr('data-tooltip-alignh', 'center');
            $(emojiEl).mouseup(function() {
                mogicons.insertEmoticon($(this).text());
            });

            $(emojiSection).append(emojiEl);
        }

        $(navigationEl).append(navItemEl);
        $(containerEl).append(emojiSection);
    }

    $('body').append(containerEl);

    this.createTogglers = function() {
        // Feed /  Timeline / Group
        $('.UFICommentAttachmentButtons')
            .not('[data-mog-toggler]')
            .each(function() {
                $(this).attr('data-mog-toggler', 1);
                createToggler(this);
            });
    };

    function createToggler(conteinterEl) {
        var toggler = $('<span>');
        $(toggler).addClass('mog-toggler');

        $(toggler).attr('data-hover', 'tooltip');
        $(toggler).attr('data-tooltip-alignh', 'center');
        $(toggler).attr('data-tooltip-content', 'Mogicons');

        $(toggler).click(function() {
            mogicons.showEmopop(this);
        });

        $(toggler).append($('<i>'));
        $(conteinterEl).append(toggler);
    }



    this.showEmopop = function(toggler, recurseLvl) {
        recurseLvl = (recurseLvl ? recurseLvl + 1 : 0);

        this.hideEmopop();

        if (!findTextInput(toggler)) {
            if (recurseLvl < 10) {
                setTimeout(function() {
                    mogicons.showEmopop(toggler, recurseLvl);
                }, 100);
            }

            return;
        }

        targetInput.focus();

        $(containerEl).removeClass('mog-status-toggler');
        if ($(toggler).attr('data-mog-status-toggler') === '1') {
            $(containerEl).addClass('mog-status-toggler');
        }

        var offset = $(toggler).offset();
        var offsetTop = offset.top - $(containerEl).outerHeight() - 10;
        var offsetLeft = offset.left - $(containerEl).outerWidth() + 28;

        $(containerEl).css({
            'display': 'block',
            'top': offsetTop,
            'left': offsetLeft
        });

        $('.mog-bubble-arrow', containerEl).removeClass('mog-bubble-arrow-up mog-bubble-arrow-down');

        if (offsetTop < 0) {
            $('.mog-bubble-arrow', containerEl).addClass('mog-bubble-arrow-up');
            $(containerEl).css({
                'top': offset.top + 27
            });
        } else {
            $('.mog-bubble-arrow', containerEl).addClass('mog-bubble-arrow-down');
        }

        targetInput.focus();

        $(toggler).addClass('mog-active');
    };

    this.hideEmopop = function() {
        $('.mog-toggler.mog-active').removeClass('mog-active');
        $(containerEl).hide();
        targetInput = null;
    };

    this.insertEmoticon = function(emoticonStr) {
        if (!targetInput) {
            alert('Something unexpected happened. Try to refresh the page ;)');
            return;
        }

        targetInput.focus();


        setTimeout(function() {
            targetInput.focus();
            //document.execCommand("insertText", false, emoticonStr);

            var inputEvent = document.createEvent('TextEvent');
            inputEvent.initTextEvent('textInput', true, true, window, emoticonStr);
            targetInput.dispatchEvent(inputEvent);
            setTimeout(function() {
                targetInput.blur();
                targetInput.focus();
            }, 20);
        }, 50);


    };

    function findTextInput(toggler) {
        var togglerParentEl = $(toggler).parent();

        while (togglerParentEl.length > 0) {

            if ($('div[contenteditable]', togglerParentEl).length > 0) {
                targetInput = $('div[contenteditable]', togglerParentEl)[0];
                return true;
            }

            if ($('textarea', togglerParentEl).length > 0) {
                targetInput = $('textarea', togglerParentEl)[0];
                return true;
            }

            if ($('.UFICommentContainer', togglerParentEl).length > 0) {
                return false;
            }

            togglerParentEl = $(togglerParentEl).parent();
        }

        return false;
    }
}