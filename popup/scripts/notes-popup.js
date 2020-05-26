"use strict";
const FONT_SIZES = ["13px", "14px", "16px", "18px"];

const saveBtn = document.getElementById("save-btn");
const delBtn = document.getElementById("delete-btn");
const fontSizeBtn = document.getElementById("font-size-btn");
const highlighterBtn = document.getElementById("highlighter-btn");
const note = document.getElementById("note");

let fontSize = "14px";

const tabParams = { active: true, currentWindow: true };
let url;
chrome.tabs.query(tabParams, function (tabs) {
	url = tabs[0].url;
});

window.addEventListener("load", renderNotes);
saveBtn.addEventListener("click", saveNote);
delBtn.addEventListener("click", delNote);
fontSizeBtn.addEventListener("click", changeFontSize);

(function setUpFontSize() {
	chrome.storage.sync.get("highlighterExtFontSize", function (results) {
		fontSize = results.highlighterExtFontSize;
		note.style.fontSize = fontSize;
	});
})();

highlighterBtn.addEventListener("click", function () {
	chrome.browserAction.setPopup({ popup: "/popup/highlighter-popup.html" });
});

function renderNotes() {
	chrome.storage.sync.get("notesExt", function (results) {
		let notes = results.notesExt;
		if (notes[url]) note.value = notes[url];
	});
}

function saveNote() {
	changeBtnClr(saveBtn, "green", 1500);
	chrome.storage.sync.get("notesExt", function (results) {
		let notes = results.notesExt;
		notes[url] = note.value;
		chrome.storage.sync.set({ notesExt: notes });
	});
}

function delNote() {
	changeBtnClr(delBtn, "red", 1500);
	chrome.storage.sync.get("notesExt", function (results) {
		let notes = results.notesExt;
		notes[url] = note.value;
		delete notes[url];
		chrome.storage.sync.set({ notesExt: notes });
		note.value = "";
	});
}

function changeFontSize() {
	changeBtnClr(fontSizeBtn, "dodgerblue", 700);
	let currFontSize = note.style.fontSize;
	let idx = FONT_SIZES.indexOf(currFontSize);
	fontSize = FONT_SIZES[(idx + 1) % FONT_SIZES.length];
	note.style.fontSize = fontSize;
	chrome.storage.sync.set({
		highlighterExtFontSize: fontSize,
	});
}

function changeBtnClr(button, clr, duration) {
	button.style.color = clr;
	setTimeout(function () {
		button.style.color = "ivory";
	}, duration);
}
