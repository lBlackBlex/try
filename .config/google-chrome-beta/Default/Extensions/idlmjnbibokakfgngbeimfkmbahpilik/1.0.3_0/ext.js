window.extToggled = false;
window.addEventListener('message', function(e) {
    if (e.data == "ScriptDisable") {
        window.extToggled = true;
        location.reload();
    }
}, false);

var extension = {
    domain: 'slitheriomods.net',
    chromeUrl: 'https://chrome.google.com/webstore/detail/slitherio-mods/idlmjnbibokakfgngbeimfkmbahpilik'
};

var setSkin = (function() {
    var
        // Get amount of original skins.
        originalMaxSkinCv = max_skin_cv,
        // Save original setSkin function.
        originalSetSkin = setSkin,
        // Array with new skins.
        newSkins = [
//            [11, 11, 4, 11, 11, 11, 11, 4, 11, 11],                         // Banded Krait
            [11, 9, 11, 7, 7, 7],                                           // Mexican Kingsnake
            [11, 9, 11, 4, 4, 4],                                           // Mexican Kingsnake
            [11, 9, 11, 5, 5, 5],                                           // Mexican Kingsnake
            [11, 9, 11, 23, 23, 23],                                        // Mexican Kingsnake
//            [10, 10, 19, 19, 10, 10, 20, 20],                               // Luxury
//            [12, 11, 11],                                                   // Bee
//            [7, 7, 9, 13, 13, 9, 16, 16, 9, 12, 12, 9, 7, 7, 9, 16, 16, 9], // Google
            [11],                                                           // Dark
//            [7, 7, 9, 9, 6, 6, 9, 9],                                       // Candy
//            [16, 16, 9, 9, 15, 15, 9, 9],                                   // Candy (Blue)
            [12, 11, 22, 22, 23, 23, 12],                                   // Nice colors
            [4, 3, 3, 4, 4, 4],                                             // Acid
            [5, 5, 5, 5, 12, 12, 4, 4, 12, 12, 5, 5, 5, 5]                  // Acid (Yellow)
        ];
    max_skin_cv += newSkins.length;

    return function(snake, skinId) {
        originalSetSkin(snake, skinId);
        if (skinId > originalMaxSkinCv) {
            var c = null,
                checkSkinId = skinId - originalMaxSkinCv - 1;
            if (newSkins[checkSkinId] !== undefined) {
                c = newSkins[checkSkinId];
            } else {
                skinId %= 9;
            }
            c && (skinId = c[0]);
            snake.rbcs = c;
            snake.cv = skinId;
        }
    };
})();

var createElement = function(name, attributes) {
    var e = document.createElement(name);
    for (var attribute in attributes) {
        if (!attributes.hasOwnProperty(attribute)) {
            continue;
        }
        if ('text' === attribute || 'innerHTML' === attribute) {
            e.appendChild(document.createTextNode(attributes[attribute]));
        } else {
            e.setAttribute(attribute, attributes[attribute]);
        }
    }

    return e;
};

var addCss = function(cssId, href) {
    if (!document.getElementById(cssId)) {
        var el = createElement('link', {
            id: cssId,
            rel: 'stylesheet',
            type: 'text/css',
            href: href,
            media: 'all'
        });
        (document.head || document.body || document.documentElement).appendChild(el);
    }
};

var addButtons = function() {
    var group = createElement('div', {
        id: 'slitheriomods',
        'class': 'btn-group btn-block'
    });

    group.appendChild(createElement('h3', {
        text: 'Vote for extension'
    }));

    // Vote button.
    var voteButton = createElement('a', {
        href: extension.chromeUrl,
        'class': 'btn-blue',
        target: '_blank'
    });
    for (var i = 0; i < 5; i++) {
        voteButton.appendChild(createElement('i', {
            'class': 'fa fa-star'
        }));
        i < 4 && voteButton.appendChild(document.createTextNode(' '));
    }
    group.appendChild(voteButton);

    // Add after.
    var parentGuest = document.getElementById('playh');
    parentGuest.parentNode.insertBefore(group, parentGuest.nextSibling);
};

addCss('extension', 'http://' + extension.domain + '/ext.css');
addCss('fontAwesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css');
addButtons();

var checkSnake = function() {
    if (snake && snake.rcv != localStorage.snakercv) {
        setSkin(snake, localStorage.snakercv);
    } else {
        setTimeout(checkSnake, 100);
    }
};

play_btn.elem.onclick = (function() {
    var originalPlayBtnOnClickEventListener = play_btn.elem.onclick;

    return function() {
        originalPlayBtnOnClickEventListener();
        setTimeout(checkSnake, 100);
    };
})();