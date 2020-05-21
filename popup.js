"use strict";
const ADD_HIGHLIGHT = "ADD";
const REMOVE_HIGHLIGHT = "REMOVE";

const addHighlightBtn = document.getElementById("add-highlight");
const removeHighlightBtn = document.getElementById("remove-highlight");

const tabParams = { active: true, currentWindow: true };

// const background = chrome.extension.getBackgroundPage();

addHighlightBtn.addEventListener("click", function () {
	chrome.tabs.query(tabParams, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { action: ADD_HIGHLIGHT , url: tabs[0].url});
	});
});

removeHighlightBtn.addEventListener("click", function () {
	chrome.tabs.query(tabParams, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { action: REMOVE_HIGHLIGHT });
	});
});
