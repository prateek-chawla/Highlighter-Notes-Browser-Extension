"use strict";
//Highlights
console.log("Script Loaded");
const ADD_HIGHLIGHT = "ADD";
const REMOVE_HIGHLIGHT = "REMOVE";
const RENDER_HIGHLIGHTS = "RENDER_HIGHLIGHTS";
//colors
const colors = {
	GREEN: "#ccff90",
	RED: "#f28b82",
	YELLOW: "#fff475",
	BLUE: "#aecbfa",
	GREY: "#e8eaed",
};

let color = colors.YELLOW;

const addHighlightBtn = document.getElementById("add-highlight");
const removeHighlightBtn = document.getElementById("remove-highlight");
const clearBtn = document.getElementById("clear-page");
const notesBtn = document.getElementById("notes-btn");
const colorPalette = document.querySelectorAll(".palette-color");
const tabParams = { active: true, currentWindow: true };

let url;
chrome.tabs.query(tabParams, function (tabs) {
	url = tabs[0].url;
});

addHighlightBtn.addEventListener("click", function (event) {
	event.preventDefault();
	console.log("Add highlight clicked with color", color);
	addHighlightBtn.style.color = "rgb(244,184,14)";
	chrome.tabs.query(tabParams, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			action: ADD_HIGHLIGHT,
			color: color,
		});
	});
});

removeHighlightBtn.addEventListener("click", function (event) {
	event.preventDefault();
	chrome.tabs.query(tabParams, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			action: REMOVE_HIGHLIGHT,
			color: color,
		});
	});
});

clearBtn.addEventListener("click", function () {
	chrome.storage.sync.get("highlightsExt", function (results) {
		console.log("clearing");
		let highlightsExt = results.highlightsExt;
		if (highlightsExt[url]) {
			delete highlightsExt[url];
			chrome.storage.sync.set(
				{ highlightsExt: highlightsExt },
				function reloadPage() {
					chrome.tabs.query(tabParams, function (tabs) {
						chrome.tabs.reload(tabs[0].id);
					});
				}
			);
		}
	});
});

colorPalette.forEach(function (clr) {
	clr.addEventListener("click", function setColor() {
		const colorStr = clr.className.split(" ")[0].toUpperCase();
		color = colors[colorStr];
	});
});
