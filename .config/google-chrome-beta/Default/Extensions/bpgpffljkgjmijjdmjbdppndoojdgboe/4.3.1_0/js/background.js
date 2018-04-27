// Copyright 2016, Vasil Nikolov (phpnikolov@gmail.com)

var thisVersion = chrome.runtime.getManifest().version;
var lastVersion = localStorage.fse2Version;

if (thisVersion !== lastVersion) {
	if (typeof lastVersion === 'undefined') {
		// On Install
		chrome.tabs.create({url:"https://www.facebook.com/mogicons/"});
	}
	else {
		// On Update
	}

	localStorage.fse2Version = thisVersion;
}