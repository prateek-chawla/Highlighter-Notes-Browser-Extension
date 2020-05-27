"use strict";
//Highlights

const ADD_HIGHLIGHT = "ADD";
const REMOVE_HIGHLIGHT = "REMOVE";
const RENDER_HIGHLIGHTS = "RENDER_HIGHLIGHTS";
const GET_BUTTON_STATUS = "GET_BUTTON_STATUS";

// COLORS
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

(function setUpBtnColors() {
	chrome.tabs.query(tabParams, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{ action: GET_BUTTON_STATUS },
			function (response) {
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError.message);
					addHighlightBtn.style.color = "ivory";
					removeHighlightBtn.style.color = "ivory";
				} else {
					if (response.addBtn) addHighlightBtn.style.color = "rgb(244,184,14)";
					else addHighlightBtn.style.color = "ivory";
					if (response.remBtn) removeHighlightBtn.style.color = "crimson";
					else removeHighlightBtn.style.color = "ivory";
				}
			}
		);
	});
})();

(function setUpColor() {
	let clrHex;
	chrome.storage.sync.get("highlighterExtColor", function (results) {
		clrHex = results.highlighterExtColor;
		colorPalette.forEach(function (clr) {
			const clrStr = clr.className.split(" ")[0].toUpperCase();
			if (clrHex === colors[clrStr]) {
				color = clrHex;
				clr.click();
				return;
			}
		});
	});
})();

addHighlightBtn.addEventListener("click", function (event) {
	event.preventDefault();
	chrome.tabs.query(tabParams, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{ action: ADD_HIGHLIGHT, color: color },
			function (response) {
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError.message);
					addHighlightBtn.style.color = "ivory";
				} else {
					if (response.switch) {
						addHighlightBtn.style.color = "rgb(244,184,14)";
						removeHighlightBtn.style.color = "ivory";
					} else addHighlightBtn.style.color = "ivory";
				}
			}
		);
	});
});

removeHighlightBtn.addEventListener("click", function (event) {
	event.preventDefault();
	chrome.tabs.query(tabParams, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{ action: REMOVE_HIGHLIGHT, color: color },
			function (response) {
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError.message);
					removeHighlightBtn.style.color = "ivory";
				} else {
					if (response.switch) {
						removeHighlightBtn.style.color = "crimson";
						addHighlightBtn.style.color = "ivory";
					} else removeHighlightBtn.style.color = "ivory";
				}
			}
		);
	});
});

clearBtn.addEventListener("click", function () {
	changeBtnClr(clearBtn, "red");
	chrome.storage.sync.get("highlightsExt", function (results) {
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
		chrome.tabs.query(tabParams, function (tabs) {
			chrome.tabs.sendMessage(
				tabs[0].id,
				{ action: GET_BUTTON_STATUS },
				function (response) {
					if (chrome.runtime.lastError) {
						console.log(chrome.runtime.lastError.message);
					} else {
						if (response.addBtn) {
							addHighlightBtn.click();
							addHighlightBtn.click();
						} else if (response.remBtn) {
							removeHighlightBtn.click();
							removeHighlightBtn.click();
						}
					}
				}
			);
		});
		chrome.storage.sync.set({ highlighterExtColor: color });
	});
});

notesBtn.addEventListener("click", function () {
	// Turn off highlighter buttons
	chrome.tabs.query(tabParams, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{ action: GET_BUTTON_STATUS },
			function (response) {
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError.message);
				} else {
					if (response.addBtn) {
						addHighlightBtn.click();
					} else if (response.remBtn) {
						removeHighlightBtn.click();
					}
				}
			}
		);
	});
	// Switch Popup
	chrome.browserAction.setPopup({ popup: "/popup/notes-popup.html" });
});

function changeBtnClr(button, clr) {
	button.style.color = clr;
	setTimeout(function () {
		button.style.color = "ivory";
	}, 1200);
}
