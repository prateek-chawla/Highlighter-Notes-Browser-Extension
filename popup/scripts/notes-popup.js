"use strict";
const FONT_SIZES = ["13px", "14px", "16px", "18px"];

const tabParams = { active: true, currentWindow: true };

let url;
chrome.tabs.query(tabParams, function (tabs) {
	url = tabs[0].url;
});
const SAVE_NOTE = "SAVE_NOTE";
const saveBtn = document.getElementById("save-btn");
const delBtn = document.getElementById("delete-btn");
const fontSizeBtn = document.getElementById("font-size-btn");
const highlighterBtn = document.getElementById("highlighter-btn");
const note = document.getElementById("note");

window.addEventListener("load", renderNotes);
saveBtn.addEventListener("click", saveNote);
delBtn.addEventListener("click", delNote);
fontSizeBtn.addEventListener("click", changeFontSize);

function renderNotes() {
	console.log("load event fired");
	console.log(note, note.value, url);
	chrome.storage.sync.get("notesExt", function (results) {
		let notes = results.notesExt;
		console.log("inside note");
		console.log(note, notes[url]);
		if (notes[url]) note.value = notes[url];
	});
}

function saveNote() {
	changeBtnClr(saveBtn, "green", 1500);
	chrome.storage.sync.get("notesExt", function (results) {
		let notes = results.notesExt;
		notes[url] = note.value;
		chrome.storage.sync.set({ notesExt: notes }, function changeBtnClr() {
			setTimeout(function () {
				saveBtn.style.color = "ivory";
			}, 500);
		});
	});
}

function delNote() {
	changeBtnClr(delBtn, "red", 1500);
	chrome.storage.sync.get("notesExt", function (results) {
		let notes = results.notesExt;
		notes[url] = note.value;
		delete notes[url];
		chrome.storage.sync.set({ notesExt: notes }, function changeBtnClr() {
			setTimeout(function () {
				delBtn.style.color = "ivory";
			}, 500);
		});
		note.value = "";
	});
}

function changeFontSize() {
	changeBtnClr(fontSizeBtn, "dodgerblue", 700);
	let currFontSize = note.style.fontSize;
	let idx = FONT_SIZES.indexOf(currFontSize);
	let newFontSize = FONT_SIZES[(idx + 1) % FONT_SIZES.length];
	note.style.fontSize = newFontSize;
}

highlighterBtn.addEventListener("click", function () {
	chrome.browserAction.setPopup({ popup: "./highlighter-popup.html" });
});

function changeBtnClr(button, clr, duration) {
	button.style.color = clr;
	setTimeout(function () {
		button.style.color = "ivory";
	}, duration);
}
