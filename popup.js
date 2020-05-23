"use strict";
//Highlights
const ADD_HIGHLIGHT = "ADD";
const REMOVE_HIGHLIGHT = "REMOVE";

const addHighlightBtn = document.getElementById("add-highlight");
const removeHighlightBtn = document.getElementById("remove-highlight");
const tabParams = { active: true, currentWindow: true };

let url;
chrome.tabs.query(tabParams, function (tabs) {
	url = tabs[0].url;
});

addHighlightBtn.addEventListener("click", function () {
	chrome.tabs.query(tabParams, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { action: ADD_HIGHLIGHT });
	});
});

removeHighlightBtn.addEventListener("click", function () {
	chrome.tabs.query(tabParams, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { action: REMOVE_HIGHLIGHT });
	});
});
//Notes
const RENDER_NOTES = "RENDER_NOTES";
const saveBtn = document.getElementById("save-btn");
const note = document.getElementById("note");

saveBtn.addEventListener("click", saveNote);

function saveNote() {
	chrome.storage.sync.get("notesExt", function (results) {
		let notes = results.notesExt;
		notes[url] = note.value;
		chrome.storage.sync.set({ notesExt: notes }, () => {
			console.log("Note Added To Storage");
		});
	});
}
window.addEventListener("load", renderNotes);

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
